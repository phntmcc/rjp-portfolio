export const DEFAULT_PHOTO_WIDTH = 1600;
export const DEFAULT_PHOTO_HEIGHT = 1067;

export const HOME_TARGET_RATIO = 328 / 530;
export const HOME_RATIO_TOLERANCE = 0.05;
export const HOME_CANDIDATE_LIMIT = 200;
export const HOME_RANDOM_POOL_SIZE = 24;

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const DISPLAY_MAX_PX = 2400;
export const THUMB_MAX_PX = 1200;
export const PHOTOGRAPHY_PAGE_SIZE = 18;
export const PHOTOGRAPHY_MAX_PAGE_SIZE = 48;

// The xl grid column is (1344 - 96 padding - 32 gap) / 3 = 405 CSS px. 1260w is
// offered only through a desktop-scoped <source>; on a ~342px phone slot 840w is
// already 2.45x, and a 3x rung would more than double mobile transfer.
export const GRID_VARIANT_WIDTHS = [420, 840, 1260] as const;
// A spanned tile is ~827px, where the standard ladder would top out at 1.5x
// supersampling. Encoded only for photos wide enough to span, and withheld from
// standard tiles by GRID_STANDARD_MAX_WIDTH.
export const GRID_WIDE_VARIANT_WIDTH = 1680;
export const GRID_STANDARD_MAX_WIDTH = 1260;
// The lightbox frame is capped at 95vh/95vw; 2400 matches DISPLAY_MAX_PX.
export const DISPLAY_VARIANT_WIDTHS = [1280, 1920, 2400] as const;

// Tiered by how each rung is painted. 420w lands in a 405px slot nearly
// pixel-for-pixel with no downsample to mask artifacts, so it needs the
// headroom; wider rungs are always halved into their slot, which hides far more.
// At 420w, q45 averaged 13.9KB and q58 21.2KB across 6 photos.
export const AVIF_GRID_QUALITY_1X = 58;
export const AVIF_GRID_QUALITY_2X = 50;
// Originals were discarded, so 2400px is a hard ceiling and quality is the only
// lever left; a 1440p lightbox supersamples by barely 1.17x. Across 5 photos q50
// averaged 300KB and q58 425KB, which is fine for an explicit click.
export const AVIF_DISPLAY_QUALITY = 58;
// Beyond 4 the encoder buys ~2% bytes for 3x the time.
export const AVIF_EFFORT = 4;

export const BLUR_PLACEHOLDER_PX = 16;
export const BLUR_PLACEHOLDER_QUALITY = 40;

// Object paths embed an immutable uuid, so they can be cached for a year.
// The Supabase SDK only accepts a seconds value and emits `max-age=<n>`.
export const STORAGE_CACHE_CONTROL_SECONDS = "31536000";

// Desktop deliberately over-declares. A rung matched to the 405px slot exactly
// is painted 1:1 on a 1x screen with no supersampling to average away artifacts,
// which reads soft at any quality. Declaring 810px makes 1x pick 840w.
export const GRID_DESKTOP_MEDIA = "(min-width: 1280px)";
export const GRID_DESKTOP_SIZES = "810px";

// Tablet and phone declarations stay honest, capped below the widest rung so a
// 3x device cannot pull 1260w into a slot less than half that wide.
export const GRID_SIZES =
	"(min-width: 768px) calc((100vw - 112px) / 2), calc(100vw - 48px)";
export const GRID_NARROW_MAX_WIDTH = 840;

export const GRID_PICTURE_SOURCES = [
	{
		media: GRID_DESKTOP_MEDIA,
		sizes: GRID_DESKTOP_SIZES,
		// Without the cap a 2x desktop resolves 810px to 1620px and pulls the wide
		// rung into a 405px slot.
		maxWidth: GRID_STANDARD_MAX_WIDTH,
	},
	{ sizes: GRID_SIZES, maxWidth: GRID_NARROW_MAX_WIDTH },
] as const;

// 405.33 * 2 + 16 gap = 827 CSS px, over-declared 2x as above.
export const GRID_WIDE_DESKTOP_SIZES = "1654px";
export const GRID_WIDE_PICTURE_SOURCES = [
	{
		media: GRID_DESKTOP_MEDIA,
		sizes: GRID_WIDE_DESKTOP_SIZES,
		maxWidth: GRID_WIDE_VARIANT_WIDTH,
	},
	{ sizes: GRID_SIZES, maxWidth: GRID_NARROW_MAX_WIDTH },
] as const;

// The home card is a single image, so it only needs the cap.
export const HOME_CARD_SIZES = "(max-width: 1024px) 100vw, 328px";
export const HOME_CARD_PICTURE_SOURCES = [
	{ sizes: HOME_CARD_SIZES, maxWidth: GRID_NARROW_MAX_WIDTH },
] as const;

// Two rows of three at xl.
export const GRID_PRIORITY_COUNT = 6;

/** Above square, so near-square crops stay single-column. */
export const WIDE_TILE_MIN_RATIO = 1.2;

export function isWideTile(width: number, height: number) {
	return height > 0 && width / height >= WIDE_TILE_MIN_RATIO;
}

/**
 * Caps each rung at the source width and dedupes, so a `w` descriptor can never
 * claim more pixels than the file holds.
 */
export function capLadderWidths(widths: readonly number[], maxWidth: number) {
	const capped = new Set(widths.map((width) => Math.min(width, maxWidth)));
	return [...capped].sort((a, b) => a - b);
}

/** The grid rungs a photo should have on disk. */
export function gridLadderWidths(width: number, height: number) {
	const widths = isWideTile(width, height)
		? [...GRID_VARIANT_WIDTHS, GRID_WIDE_VARIANT_WIDTH]
		: GRID_VARIANT_WIDTHS;
	return capLadderWidths(widths, width);
}
