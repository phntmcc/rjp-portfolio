import type { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";
import {
	avifObjectPath,
	type PhotoVariants,
	type PhotoVariantWidthMap,
	type VariantRole,
} from "@/lib/photo-variants";
import {
	AVIF_DISPLAY_QUALITY,
	AVIF_EFFORT,
	AVIF_GRID_QUALITY_1X,
	AVIF_GRID_QUALITY_2X,
	BLUR_PLACEHOLDER_PX,
	BLUR_PLACEHOLDER_QUALITY,
	capLadderWidths,
	DISPLAY_MAX_PX,
	DISPLAY_VARIANT_WIDTHS,
	GRID_VARIANT_WIDTHS,
	gridLadderWidths,
	STORAGE_CACHE_CONTROL_SECONDS,
	THUMB_MAX_PX,
} from "@/lib/photography-constants";
import { getPhotosBucketName } from "@/lib/supabase/env";

export type EncodedVariant = {
	role: VariantRole;
	width: number;
	buffer: Buffer;
};

/**
 * The narrowest grid rung fills its slot ~1:1 on 1x displays and needs the extra
 * headroom; every wider rung is downsampled by at least 2x, which hides more.
 */
function variantQuality(role: VariantRole, width: number) {
	if (role === "display") return AVIF_DISPLAY_QUALITY;
	return width <= GRID_VARIANT_WIDTHS[0]
		? AVIF_GRID_QUALITY_1X
		: AVIF_GRID_QUALITY_2X;
}

function createBasePipeline(source: Buffer) {
	// `.rotate()` with no argument bakes in EXIF orientation. It is a no-op on
	// already-normalised buffers, so this is safe for both the original upload
	// and the stored display JPEG used during backfill.
	return sharp(source, { failOn: "none" }).rotate();
}

export async function readImageSize(source: Buffer) {
	const { width, height, orientation } =
		await createBasePipeline(source).metadata();
	if (!width || !height) {
		throw new Error("Could not read image dimensions");
	}
	// `metadata()` reports the stored buffer, so an EXIF quarter-turn still has
	// its axes transposed relative to how `.rotate()` will render it.
	const quarterTurned = typeof orientation === "number" && orientation >= 5;
	return quarterTurned ? { width: height, height: width } : { width, height };
}

export async function renderBlurDataUrl(source: Buffer) {
	const buffer = await createBasePipeline(source)
		.resize(BLUR_PLACEHOLDER_PX, BLUR_PLACEHOLDER_PX, { fit: "inside" })
		.webp({ quality: BLUR_PLACEHOLDER_QUALITY })
		.toBuffer();

	return `data:image/webp;base64,${buffer.toString("base64")}`;
}

export async function renderDisplayJpeg(source: Buffer) {
	return createBasePipeline(source)
		.resize(DISPLAY_MAX_PX, DISPLAY_MAX_PX, {
			fit: "inside",
			withoutEnlargement: true,
		})
		.jpeg({ quality: 82, mozjpeg: true, progressive: true })
		.toBuffer({ resolveWithObject: true });
}

export async function renderThumbJpeg(displayBuffer: Buffer) {
	return sharp(displayBuffer)
		.resize(THUMB_MAX_PX, THUMB_MAX_PX, {
			fit: "inside",
			withoutEnlargement: true,
		})
		.jpeg({ quality: 74, mozjpeg: true, progressive: true })
		.toBuffer();
}

/**
 * Encodes the full AVIF ladder for both roles. Runs sequentially: AVIF encoding
 * is CPU bound and holding several 2400px buffers at once risks exhausting the
 * function's memory for no wall-clock gain.
 */
export async function renderAvifLadder(
	source: Buffer,
	displayWidth: number,
	displayHeight: number,
) {
	const base = createBasePipeline(source);
	const variants: EncodedVariant[] = [];
	const roleWidths: Record<VariantRole, readonly number[]> = {
		grid: gridLadderWidths(displayWidth, displayHeight),
		display: capLadderWidths(DISPLAY_VARIANT_WIDTHS, displayWidth),
	};

	for (const role of Object.keys(roleWidths) as VariantRole[]) {
		for (const width of roleWidths[role]) {
			const buffer = await base
				.clone()
				.resize({ width, withoutEnlargement: true })
				.avif({
					quality: variantQuality(role, width),
					effort: AVIF_EFFORT,
					chromaSubsampling: "4:2:0",
				})
				.toBuffer();

			variants.push({ role, width, buffer });
		}
	}

	return variants;
}

export async function uploadPhotoObject({
	client,
	path,
	body,
	contentType,
	upsert = false,
}: {
	client: SupabaseClient;
	path: string;
	body: Buffer;
	contentType: string;
	upsert?: boolean;
}) {
	const bucket = getPhotosBucketName();
	const { error } = await client.storage.from(bucket).upload(path, body, {
		contentType,
		upsert,
		cacheControl: STORAGE_CACHE_CONTROL_SECONDS,
	});
	if (error) {
		throw new Error(`Failed to upload ${path}: ${error.message}`);
	}

	return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function uploadAvifLadder({
	client,
	photoId,
	variants,
	upsert = false,
}: {
	client: SupabaseClient;
	photoId: string;
	variants: EncodedVariant[];
	upsert?: boolean;
}): Promise<PhotoVariants> {
	const avif: Partial<Record<VariantRole, PhotoVariantWidthMap>> = {};

	for (const variant of variants) {
		const url = await uploadPhotoObject({
			client,
			path: avifObjectPath(photoId, variant.role, variant.width),
			body: variant.buffer,
			contentType: "image/avif",
			upsert,
		});

		const roleMap = avif[variant.role] ?? {};
		roleMap[String(variant.width)] = url;
		avif[variant.role] = roleMap;
	}

	return { avif };
}

/**
 * Rewrites an existing object in place so it picks up the long cache lifetime.
 * Supabase stores `cache-control` as object metadata at write time, so the only
 * way to change it is to upload the bytes again.
 */
export async function refreshObjectCacheControl({
	client,
	path,
	contentType,
}: {
	client: SupabaseClient;
	path: string;
	contentType: string;
}) {
	const bucket = getPhotosBucketName();
	const { data, error } = await client.storage.from(bucket).download(path);
	if (error || !data) {
		throw new Error(
			`Failed to download ${path}: ${error?.message ?? "no data"}`,
		);
	}

	await uploadPhotoObject({
		client,
		path,
		body: Buffer.from(await data.arrayBuffer()),
		contentType,
		upsert: true,
	});
}
