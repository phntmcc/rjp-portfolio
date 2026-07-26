/**
 * Brings stored photos up to the current AVIF ladder, and rewrites their JPEG
 * objects so they pick up the long cache lifetime. By default it only touches
 * rows actually missing a rung, so widening the ladder re-encodes just the
 * photos that gained one; `--force` re-encodes everything.
 *
 * The original camera files were never stored, so variants are re-encoded from
 * the display JPEG. 2400px is therefore a hard ceiling for existing photos.
 *
 *   npm run backfill:variants
 *
 * To pass flags, invoke tsx directly: npm strips them on Windows shells.
 *
 *   npx tsx --env-file-if-exists=.env.local \
 *     scripts/backfill-photo-variants.ts [--force] [--limit=N] [--prune] [--dry-run]
 */
import { parsePhotoVariants } from "@/lib/photo-variants";
import { gridLadderWidths } from "@/lib/photography-constants";
import {
	readImageSize,
	refreshObjectCacheControl,
	renderAvifLadder,
	renderBlurDataUrl,
	uploadAvifLadder,
} from "@/lib/photography-variants";
import { getPhotosBucketName } from "@/lib/supabase/env";
import { createSupabaseServiceServerClient } from "@/lib/supabase/server";

type BackfillRow = {
	id: string;
	image_path: string;
	thumb_path: string;
	width: number | null;
	height: number | null;
	variants: unknown;
};

/**
 * True when a row is missing any rung the current ladder calls for, so widening
 * the ladder re-encodes only the photos that gained one. `gridLadderWidths` caps
 * its result at the stored width, so a narrow photo cannot be flagged forever.
 */
function needsVariants(row: BackfillRow) {
	const grid = parsePhotoVariants(row.variants)?.avif?.grid;
	if (!grid) return true;
	if (!row.width || !row.height) return false;

	return gridLadderWidths(row.width, row.height).some(
		(width) => !(String(width) in grid),
	);
}

function parseArgs(argv: string[]) {
	const limitArg = argv.find((arg) => arg.startsWith("--limit="));
	const limit = limitArg ? Number(limitArg.split("=")[1]) : null;

	return {
		force: argv.includes("--force"),
		prune: argv.includes("--prune"),
		dryRun: argv.includes("--dry-run"),
		limit: limit && Number.isFinite(limit) && limit > 0 ? limit : null,
	};
}

/**
 * Deletes AVIF objects no longer referenced by any row. Only touches `avif/`;
 * the JPEGs under `display/` and `thumb/` are never considered.
 */
async function pruneOrphanedVariants(
	client: ReturnType<typeof createSupabaseServiceServerClient>,
	bucket: string,
	dryRun: boolean,
) {
	const { data, error } = await client.from("photos").select("variants");
	if (error || !data) {
		throw new Error(`Failed to read variants: ${error?.message ?? "no data"}`);
	}

	const marker = `/public/${bucket}/`;
	const referenced = new Set<string>();
	for (const row of data) {
		const parsed = parsePhotoVariants(row.variants);
		for (const roleMap of Object.values(parsed?.avif ?? {})) {
			for (const url of Object.values(roleMap)) {
				const path = url.split(marker)[1];
				if (path) referenced.add(decodeURIComponent(path));
			}
		}
	}

	const stale: string[] = [];
	for (const role of ["grid", "display"]) {
		const prefix = `avif/${role}`;
		for (let offset = 0; ; ) {
			const listing = await client.storage
				.from(bucket)
				.list(prefix, { limit: 1000, offset });
			if (listing.error) {
				throw new Error(`Failed to list ${prefix}: ${listing.error.message}`);
			}
			const objects = listing.data ?? [];
			if (objects.length === 0) break;

			for (const object of objects) {
				const path = `${prefix}/${object.name}`;
				if (!referenced.has(path)) stale.push(path);
			}
			if (objects.length < 1000) break;
			offset += objects.length;
		}
	}

	if (dryRun) {
		for (const path of stale) {
			console.log(`  would remove ${path}`);
		}
		return stale.length;
	}

	for (let index = 0; index < stale.length; index += 100) {
		const batch = stale.slice(index, index + 100);
		const { error: removeError } = await client.storage
			.from(bucket)
			.remove(batch);
		if (removeError) {
			throw new Error(`Failed to remove objects: ${removeError.message}`);
		}
	}

	return stale.length;
}

async function main() {
	const { dryRun, force, limit, prune } = parseArgs(process.argv.slice(2));
	const client = createSupabaseServiceServerClient();
	const bucket = getPhotosBucketName();

	const { data, error } = await client
		.from("photos")
		.select("id,image_path,thumb_path,width,height,variants")
		.order("created_at", { ascending: true });

	if (error || !data) {
		throw new Error(`Failed to list photos: ${error?.message ?? "no data"}`);
	}

	const rows = (data as BackfillRow[]).filter(
		(row) => force || needsVariants(row),
	);
	const targets = limit ? rows.slice(0, limit) : rows;

	console.log(
		`Bucket ${bucket}: ${targets.length} of ${data.length} photos to process.`,
	);

	let processed = 0;
	const failures: string[] = [];

	for (const row of targets) {
		const position = `[${processed + 1}/${targets.length}]`;
		try {
			const download = await client.storage
				.from(bucket)
				.download(row.image_path);
			if (download.error || !download.data) {
				throw new Error(
					`Missing display object: ${download.error?.message ?? "no data"}`,
				);
			}

			const source = Buffer.from(await download.data.arrayBuffer());
			const stored =
				row.width && row.height
					? { width: row.width, height: row.height }
					: await readImageSize(source);

			const encoded = await renderAvifLadder(
				source,
				stored.width,
				stored.height,
			);
			// Re-running the script must be able to overwrite a partial ladder left
			// behind by an earlier failure.
			const variants = await uploadAvifLadder({
				client,
				photoId: row.id,
				variants: encoded,
				upsert: true,
			});
			const blurDataUrl = await renderBlurDataUrl(source);

			for (const path of [row.image_path, row.thumb_path]) {
				await refreshObjectCacheControl({
					client,
					path,
					contentType: "image/jpeg",
				});
			}

			const { error: updateError } = await client
				.from("photos")
				.update({ variants, blur_data_url: blurDataUrl })
				.eq("id", row.id);
			if (updateError) {
				throw new Error(updateError.message);
			}

			processed += 1;
			console.log(`${position} ${row.id} - ${encoded.length} variants`);
		} catch (cause) {
			processed += 1;
			const message = cause instanceof Error ? cause.message : String(cause);
			failures.push(`${row.id}: ${message}`);
			console.error(`${position} ${row.id} - FAILED: ${message}`);
		}
	}

	if (failures.length > 0) {
		console.error(`\n${failures.length} photo(s) failed:`);
		for (const failure of failures) {
			console.error(`  ${failure}`);
		}
		// Pruning against a partially updated set could delete live objects.
		console.error("Skipping prune because some photos failed.");
		process.exitCode = 1;
		return;
	}

	console.log(`\nDone. ${targets.length} photo(s) processed.`);

	if (prune) {
		const removed = await pruneOrphanedVariants(client, bucket, dryRun);
		console.log(
			dryRun
				? `Dry run: ${removed} orphaned AVIF object(s) would be pruned.`
				: `Pruned ${removed} orphaned AVIF object(s).`,
		);
	}
}

main().catch((cause) => {
	console.error(cause);
	process.exitCode = 1;
});
