import {
	DEFAULT_PHOTO_HEIGHT,
	DEFAULT_PHOTO_WIDTH,
	HOME_CANDIDATE_LIMIT,
	HOME_RANDOM_POOL_SIZE,
	HOME_RATIO_TOLERANCE,
	HOME_TARGET_RATIO,
	PHOTOGRAPHY_MAX_PAGE_SIZE,
	PHOTOGRAPHY_PAGE_SIZE,
} from "@/lib/photography-constants";
import { createSupabasePublicServerClient } from "@/lib/supabase/server";

type PhotoRow = {
	id: string;
	title: string | null;
	description: string | null;
	location_name: string;
	location_slug: string;
	shot_at: string | null;
	iso: string | null;
	aperture: string | null;
	shutter_speed: string | null;
	thumb_url: string;
	display_url: string;
	width: number | null;
	height: number | null;
	blur_data_url: string | null;
	created_at: string;
};

type HomePhotoRow = {
	id: string;
	location_name: string;
	shot_at: string | null;
	iso: string | null;
	aperture: string | null;
	shutter_speed: string | null;
	thumb_url: string;
	display_url: string;
	width: number | null;
	height: number | null;
};

export type PhotographyPhoto = {
	id: string;
	title: string | null;
	description: string | null;
	locationName: string;
	locationSlug: string;
	shotAt: string | null;
	shotAtLabel: string;
	iso: string | null;
	aperture: string | null;
	shutterSpeed: string | null;
	thumbUrl: string;
	displayUrl: string;
	width: number;
	height: number;
	blurDataUrl: string | null;
	createdAt: string;
};

export type PhotographyLocation = {
	slug: string;
	name: string;
};

export type HomePhotographyPhoto = {
	id: string;
	imageSrc: string;
	imageSrcLightbox: string;
	width: number;
	height: number;
	place: string;
	date: string;
	iso: string;
	aperture: string;
	shutterSpeed: string;
};

export type PhotographyPhotoPage = {
	photos: PhotographyPhoto[];
	hasMore: boolean;
	nextOffset: number;
};

const shotDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
});

function formatShotAtLabel(value: string | null) {
	if (!value) return "Date unknown";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.valueOf())) return "Date unknown";
	return shotDateFormatter.format(parsed);
}

function mapPhotoRow(row: PhotoRow): PhotographyPhoto {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		locationName: row.location_name,
		locationSlug: row.location_slug,
		shotAt: row.shot_at,
		shotAtLabel: formatShotAtLabel(row.shot_at),
		iso: row.iso,
		aperture: row.aperture,
		shutterSpeed: row.shutter_speed,
		thumbUrl: row.thumb_url,
		displayUrl: row.display_url,
		width: row.width ?? DEFAULT_PHOTO_WIDTH,
		height: row.height ?? DEFAULT_PHOTO_HEIGHT,
		blurDataUrl: row.blur_data_url,
		createdAt: row.created_at,
	};
}

type GetPhotographyPhotosPageOptions = {
	locationSlug?: string;
	offset?: number;
	limit?: number;
};

export async function getPhotographyPhotosPage({
	locationSlug,
	offset = 0,
	limit = PHOTOGRAPHY_PAGE_SIZE,
}: GetPhotographyPhotosPageOptions = {}): Promise<PhotographyPhotoPage> {
	const safeOffset = Math.max(0, Math.floor(offset));
	const safeLimit = Math.max(
		1,
		Math.min(PHOTOGRAPHY_MAX_PAGE_SIZE, Math.floor(limit)),
	);
	const supabase = createSupabasePublicServerClient();
	let query = supabase
		.from("photos")
		.select(
			"id,title,description,location_name,location_slug,shot_at,iso,aperture,shutter_speed,thumb_url,display_url,width,height,blur_data_url,created_at",
		)
		.order("shot_at", { ascending: false, nullsFirst: false })
		.order("created_at", { ascending: false })
		.order("id", { ascending: false })
		.range(safeOffset, safeOffset + safeLimit);

	if (locationSlug) {
		query = query.eq("location_slug", locationSlug);
	}

	const { data, error } = await query;
	if (error || !data) {
		return {
			photos: [],
			hasMore: false,
			nextOffset: safeOffset,
		};
	}

	const rows = data as PhotoRow[];
	const hasMore = rows.length > safeLimit;
	const photos = rows.slice(0, safeLimit).map(mapPhotoRow);

	return {
		photos,
		hasMore,
		nextOffset: safeOffset + photos.length,
	};
}

export async function getPhotographyPhotos(locationSlug?: string) {
	const photos: PhotographyPhoto[] = [];
	let offset = 0;
	let hasMore = true;

	while (hasMore) {
		const page = await getPhotographyPhotosPage({ locationSlug, offset });
		photos.push(...page.photos);
		offset = page.nextOffset;
		hasMore = page.hasMore;
	}

	return photos;
}

export async function getPhotographyLocations() {
	const supabase = createSupabasePublicServerClient();
	const { data, error } = await supabase
		.from("photos")
		.select("location_name,location_slug")
		.order("location_name", { ascending: true });

	if (error || !data) {
		return [] as PhotographyLocation[];
	}

	const deduped = new Map<string, string>();
	for (const item of data) {
		if (!item.location_slug || !item.location_name) continue;
		if (!deduped.has(item.location_slug)) {
			deduped.set(item.location_slug, item.location_name);
		}
	}

	return [...deduped.entries()].map(([slug, name]) => ({ slug, name }));
}

function mapToHomePhoto(row: HomePhotoRow): HomePhotographyPhoto {
	return {
		id: row.id,
		imageSrc: row.thumb_url,
		imageSrcLightbox: row.display_url,
		width: row.width ?? DEFAULT_PHOTO_WIDTH,
		height: row.height ?? DEFAULT_PHOTO_HEIGHT,
		place: row.location_name,
		date: formatShotAtLabel(row.shot_at),
		iso: row.iso ?? "N/A",
		aperture: row.aperture ?? "N/A",
		shutterSpeed: row.shutter_speed ?? "N/A",
	};
}

function byClosestRatioToHome(a: HomePhotoRow, b: HomePhotoRow) {
	const aRatio = (a.width ?? 1) / (a.height ?? 1);
	const bRatio = (b.width ?? 1) / (b.height ?? 1);
	return (
		Math.abs(aRatio - HOME_TARGET_RATIO) - Math.abs(bRatio - HOME_TARGET_RATIO)
	);
}

export async function getRandomHomePhotographyPhoto() {
	const supabase = createSupabasePublicServerClient();
	const { data, error } = await supabase
		.from("photos")
		.select(
			"id,location_name,shot_at,iso,aperture,shutter_speed,thumb_url,display_url,width,height",
		)
		.not("width", "is", null)
		.not("height", "is", null)
		.limit(HOME_CANDIDATE_LIMIT);

	if (error || !data || data.length === 0) {
		return null;
	}

	const rows = data as HomePhotoRow[];
	const ratioMatched = rows.filter((row) => {
		if (!row.width || !row.height) return false;
		const ratio = row.width / row.height;
		return Math.abs(ratio - HOME_TARGET_RATIO) <= HOME_RATIO_TOLERANCE;
	});

	const fallbackPortrait = rows.filter((row) => {
		if (!row.width || !row.height) return false;
		return row.width < row.height;
	});

	const source = ratioMatched.length > 0 ? ratioMatched : fallbackPortrait;
	if (source.length === 0) return null;

	const candidates = source
		.sort(byClosestRatioToHome)
		.slice(0, HOME_RANDOM_POOL_SIZE);
	const selected = candidates[Math.floor(Math.random() * candidates.length)];
	return mapToHomePhoto(selected);
}
