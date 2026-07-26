export type VariantRole = "grid" | "display";

/** Maps a rendered pixel width (as a string key) to its public URL. */
export type PhotoVariantWidthMap = Record<string, string>;

export type PhotoVariants = {
	avif?: Partial<Record<VariantRole, PhotoVariantWidthMap>>;
};

const VARIANT_ROLES = ["grid", "display"] as const;

export function avifObjectPath(
	photoId: string,
	role: VariantRole,
	width: number,
) {
	return `avif/${role}/${photoId}-${width}.avif`;
}

export function parsePhotoVariants(value: unknown): PhotoVariants | null {
	if (!value || typeof value !== "object") return null;
	const avif = (value as PhotoVariants).avif;
	if (!avif || typeof avif !== "object") return null;

	const parsed: Partial<Record<VariantRole, PhotoVariantWidthMap>> = {};
	for (const role of VARIANT_ROLES) {
		const roleMap = avif[role];
		if (!roleMap || typeof roleMap !== "object") continue;
		const entries = Object.entries(roleMap).filter(
			([width, url]) =>
				Number.isFinite(Number(width)) &&
				typeof url === "string" &&
				url.length > 0,
		);
		if (entries.length > 0) {
			parsed[role] = Object.fromEntries(entries);
		}
	}

	return Object.keys(parsed).length > 0 ? { avif: parsed } : null;
}

function sortedRungs(variants: PhotoVariants | null, role: VariantRole) {
	const roleMap = variants?.avif?.[role];
	if (!roleMap) return [];

	return Object.entries(roleMap)
		.map(([width, url]) => ({ width: Number(width), url }))
		.filter((entry) => Number.isFinite(entry.width))
		.sort((a, b) => a.width - b.width);
}

/**
 * Builds a `srcset` string ordered by ascending width. `maxWidth` trims the top
 * of the ladder, which is the only way to stop a high-DPR device from selecting
 * a rung far wider than the slot it is painting into.
 */
export function buildAvifSrcSet(
	variants: PhotoVariants | null,
	role: VariantRole,
	maxWidth?: number,
) {
	const rungs = sortedRungs(variants, role).filter(
		(rung) => maxWidth === undefined || rung.width <= maxWidth,
	);
	if (rungs.length === 0) return null;
	return rungs.map((rung) => `${rung.url} ${rung.width}w`).join(", ");
}
