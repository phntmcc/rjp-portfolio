"use client";

import {
	type CSSProperties,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { PhotoExpandIcon } from "@/components/icons/photo-expand";
import { PhotoExifPanel } from "@/components/photography/photo-exif-panel";
import {
	type LightboxPhoto,
	PhotoLightbox,
} from "@/components/photography/photo-lightbox";
import { PhotoPicture } from "@/components/photography/photo-picture";
import { useStaggeredReveal } from "@/hooks/use-staggered-reveal";
import type { PhotographyLocation, PhotographyPhoto } from "@/lib/photography";
import {
	GRID_PICTURE_SOURCES,
	GRID_PRIORITY_COUNT,
	GRID_SIZES,
	GRID_WIDE_PICTURE_SOURCES,
	isWideTile,
	PHOTOGRAPHY_PAGE_SIZE,
} from "@/lib/photography-constants";

type PhotographyBoardProps = {
	initialPhotos: PhotographyPhoto[];
	initialHasMore: boolean;
	locations: PhotographyLocation[];
	activeLocation?: string;
};

// Tailwind v4 compiles `translate-y-*` and `scale-*` to the standalone
// `translate` and `scale` properties, so transitioning `transform` would let the
// offset snap while only the fade animated.
const CAPTION_MOTION =
	"transition-[opacity,translate,scale] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/** Visible on touch, where `group-hover` never resolves; hover-gated from md up. */
const CAPTION_TOUCH_VISIBLE =
	"md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100";

const CAPTION_HOVER_ONLY =
	"translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100";

/** Keeps the swap reading as a crossfade when the network responds instantly. */
const FILTER_FADE_MS = 180;

function buildLocationHref(slug?: string) {
	return slug ? `/photography?location=${slug}` : "/photography";
}

const COLUMN_CLASSES = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

/**
 * Uniform tile heights are what make spanning workable. Once columns fall out of
 * lockstep a two-column tile can only land where both columns happen to be free
 * at the same height, and the gap it leaves is too tall to ever backfill. The
 * library is 2:3, so taking the row height from a portrait crops nothing.
 */
const TILE_ASPECT = "aspect-2/3";
/** Only used by a spanned tile with no single-column neighbour to stretch to. */
const WIDE_TILE_ASPECT = "xl:aspect-[826/608]";

export function PhotographyBoard({
	initialPhotos,
	initialHasMore,
	locations,
	activeLocation,
}: PhotographyBoardProps) {
	const [selectedLocation, setSelectedLocation] = useState(
		activeLocation ?? "",
	);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [photos, setPhotos] = useState(initialPhotos);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [nextOffset, setNextOffset] = useState(initialPhotos.length);
	const [isAppending, setIsAppending] = useState(false);
	const [isSwapping, setIsSwapping] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);
	// Bumped only once a replacing fetch lands, so the outgoing grid keeps its
	// keys (and stays mounted to fade) until the new photos are ready.
	const [gridGeneration, setGridGeneration] = useState(0);
	const requestVersionRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const filterRowRef = useRef<HTMLDivElement | null>(null);
	const pillRef = useRef<HTMLSpanElement | null>(null);
	const filterButtonsRef = useRef(new Map<string, HTMLButtonElement>());
	const registerReveal = useStaggeredReveal();
	const locationQueryParam = selectedLocation || undefined;
	const isBusy = isAppending || isSwapping;

	const measurePill = useCallback(() => {
		const pill = pillRef.current;
		const active = filterButtonsRef.current.get(selectedLocation);
		if (!pill || !active) return;

		pill.style.width = `${active.offsetWidth}px`;
		pill.style.transform = `translate3d(${active.offsetLeft}px, ${active.offsetTop}px, 0)`;

		if (!pill.dataset.ready) {
			// Commit the first placement before the transition exists, otherwise it
			// animates in from the row origin.
			void pill.offsetWidth;
			pill.dataset.ready = "1";
		}
	}, [selectedLocation]);

	useEffect(() => {
		measurePill();

		const row = filterRowRef.current;
		if (!row) return;

		// Catches both viewport resizes and the row rewrapping onto another line.
		const observer = new ResizeObserver(() => measurePill());
		observer.observe(row);
		// Metric widths shift once the webfont swaps in.
		void document.fonts?.ready.then(() => measurePill());

		return () => observer.disconnect();
	}, [measurePill]);

	const fetchPhotosPage = useCallback(
		async ({
			locationSlug,
			offset,
			append,
		}: {
			locationSlug?: string;
			offset: number;
			append: boolean;
		}) => {
			const requestVersion = requestVersionRef.current;
			const params = new URLSearchParams({
				offset: String(offset),
				limit: String(PHOTOGRAPHY_PAGE_SIZE),
			});
			if (locationSlug) {
				params.set("location", locationSlug);
			}

			const response = await fetch(
				`/api/photography/photos?${params.toString()}`,
			);
			if (!response.ok) {
				throw new Error("Failed to load photos");
			}

			const payload = (await response.json()) as {
				photos: PhotographyPhoto[];
				hasMore: boolean;
				nextOffset: number;
			};

			if (requestVersion !== requestVersionRef.current) return;

			setPhotos((current) => {
				if (!append) return payload.photos;
				if (payload.photos.length === 0) return current;
				return [...current, ...payload.photos];
			});
			if (!append) {
				setGridGeneration((generation) => generation + 1);
			}
			setHasMore(payload.hasMore);
			setNextOffset(payload.nextOffset);
			setLoadError(null);
		},
		[],
	);

	const loadMorePhotos = useCallback(async () => {
		if (isBusy || !hasMore) return;
		setIsAppending(true);
		try {
			await fetchPhotosPage({
				locationSlug: locationQueryParam,
				offset: nextOffset,
				append: true,
			});
		} catch {
			setLoadError("Could not load more photos.");
		} finally {
			setIsAppending(false);
		}
	}, [fetchPhotosPage, hasMore, isBusy, locationQueryParam, nextOffset]);

	useEffect(() => {
		if (!hasMore || isBusy) return;
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					void loadMorePhotos();
				}
			},
			{ rootMargin: "600px 0px" },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMore, isBusy, loadMorePhotos]);

	const safeActiveIndex =
		activeIndex !== null && activeIndex < photos.length ? activeIndex : null;

	const lightboxPhotos: LightboxPhoto[] = photos.map((photo) => ({
		id: photo.id,
		src: photo.displayUrl,
		alt: photo.title ?? `${photo.locationName} photo`,
		width: photo.width,
		height: photo.height,
		locationName: photo.locationName,
		shotAtLabel: photo.shotAtLabel,
		iso: photo.iso,
		aperture: photo.aperture,
		shutterSpeed: photo.shutterSpeed,
		thumbUrl: photo.thumbUrl,
		blurDataUrl: photo.blurDataUrl,
		variants: photo.variants,
	}));

	const close = useCallback(() => setActiveIndex(null), []);

	const open = useCallback((index: number) => setActiveIndex(index), []);

	const goPrevious = useCallback(() => {
		setActiveIndex((current) => {
			if (current === null) return current;
			return (current - 1 + photos.length) % photos.length;
		});
	}, [photos.length]);

	const goNext = useCallback(() => {
		setActiveIndex((current) => {
			if (current === null) return current;
			return (current + 1) % photos.length;
		});
	}, [photos.length]);

	const handleFilterSelect = useCallback(
		async (slug?: string) => {
			const next = slug ?? "";
			if (next === selectedLocation) return;

			// Discards any append still in flight for the previous location.
			requestVersionRef.current += 1;
			setSelectedLocation(next);
			setActiveIndex(null);
			window.history.replaceState({}, "", buildLocationHref(next || undefined));
			setIsSwapping(true);

			try {
				await Promise.all([
					fetchPhotosPage({
						locationSlug: next || undefined,
						offset: 0,
						append: false,
					}),
					new Promise((resolve) => setTimeout(resolve, FILTER_FADE_MS)),
				]);
			} catch {
				setPhotos([]);
				setHasMore(true);
				setNextOffset(0);
				setLoadError("Could not load photos for this location.");
			} finally {
				setIsSwapping(false);
			}
		},
		[fetchPhotosPage, selectedLocation],
	);

	const handleOpenPhoto = useCallback(
		(photoId: string) => {
			const index = photos.findIndex((photo) => photo.id === photoId);
			if (index < 0) return;
			open(index);
		},
		[open, photos],
	);

	const registerFilterButton = useCallback(
		(slug: string) => (node: HTMLButtonElement | null) => {
			if (node) {
				filterButtonsRef.current.set(slug, node);
				return;
			}
			filterButtonsRef.current.delete(slug);
		},
		[],
	);

	const skeletonKeys = ["skeleton-1", "skeleton-2", "skeleton-3"];

	const filterOptions = [
		{ slug: "", name: "All" },
		...locations.map((location) => ({
			slug: location.slug,
			name: location.name,
		})),
	];

	return (
		<>
			<div
				ref={filterRowRef}
				className="relative mb-6 flex flex-wrap items-center gap-2"
			>
				<span
					ref={pillRef}
					aria-hidden
					className="photo-filter-pill pointer-events-none absolute left-0 top-0 h-[30px] rounded-full border border-white/30 bg-white/10"
				/>
				{filterOptions.map((option) => (
					<button
						key={option.slug || "all"}
						ref={registerFilterButton(option.slug)}
						type="button"
						onClick={() => void handleFilterSelect(option.slug || undefined)}
						className={`relative z-10 cursor-pointer rounded-full border border-transparent px-3 py-1.5 text-xs transition-colors duration-300 ${
							selectedLocation === option.slug
								? "text-white"
								: "text-neutral-300 hover:text-white"
						}`}
					>
						{option.name}
					</button>
				))}
			</div>

			{photos.length === 0 && !isSwapping ? (
				<div className="rounded-2xl border border-white/10 bg-white/3 p-6">
					<p className="text-sm text-neutral-400">
						No photos found for this location yet.
					</p>
				</div>
			) : null}

			<div
				aria-busy={isSwapping}
				className={`grid grid-flow-row-dense gap-4 transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none ${COLUMN_CLASSES} ${
					isSwapping ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
				}`}
			>
				{photos.map((photo, index) => {
					// The first rows carry the LCP, so they must not wait on hydration
					// behind an opacity gate.
					const deferred = index >= GRID_PRIORITY_COUNT;
					const hasExif = Boolean(
						photo.iso || photo.aperture || photo.shutterSpeed,
					);
					const wide = isWideTile(photo.width, photo.height);

					return (
						<figure
							key={`${gridGeneration}-${photo.id}`}
							ref={deferred ? registerReveal : undefined}
							data-photo-pending={deferred ? "" : undefined}
							style={
								deferred
									? undefined
									: ({
											"--bento-delay": `${0.04 + index * 0.04}s`,
										} as CSSProperties)
							}
							className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/3 ${TILE_ASPECT} ${
								deferred ? "" : "animate-bento-in"
							} ${wide ? `xl:col-span-2 ${WIDE_TILE_ASPECT}` : ""}`}
						>
							<button
								type="button"
								onClick={() => handleOpenPhoto(photo.id)}
								className="relative block h-full w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
								aria-label={`Open ${photo.locationName} photo in full-size viewer`}
							>
								<PhotoPicture
									src={photo.thumbUrl}
									alt={photo.title ?? `${photo.locationName} photo`}
									width={photo.width}
									height={photo.height}
									sizes={GRID_SIZES}
									sources={
										wide ? GRID_WIDE_PICTURE_SOURCES : GRID_PICTURE_SOURCES
									}
									variantRole="grid"
									variants={photo.variants}
									blurDataUrl={photo.blurDataUrl}
									priority={index < GRID_PRIORITY_COUNT}
									layout="cover"
									className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
								/>
								<div
									aria-hidden
									className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/75 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
								/>

								<div
									className={`pointer-events-none absolute right-3 top-3 z-10 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 ${CAPTION_MOTION}`}
								>
									<div
										className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.302)]"
										aria-hidden
									>
										<PhotoExpandIcon className="size-4 text-[#d4d4d4]" />
									</div>
								</div>

								<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3">
									{hasExif ? (
										<div
											className={`mb-2 hidden delay-0 group-hover:delay-[80ms] md:block ${CAPTION_MOTION} ${CAPTION_HOVER_ONLY}`}
										>
											<PhotoExifPanel
												iso={photo.iso}
												aperture={photo.aperture}
												shutterSpeed={photo.shutterSpeed}
											/>
										</div>
									) : null}
									<p
										className={`font-serif text-xl text-white ${CAPTION_MOTION} ${CAPTION_TOUCH_VISIBLE}`}
									>
										{photo.locationName}
									</p>
									<p
										className={`text-xs text-neutral-300 delay-0 group-hover:delay-[40ms] ${CAPTION_MOTION} ${CAPTION_TOUCH_VISIBLE}`}
									>
										{photo.shotAtLabel}
									</p>
								</div>
							</button>
						</figure>
					);
				})}
			</div>
			<div ref={sentinelRef} aria-hidden className="h-4" />
			{isAppending ? (
				<div aria-hidden className={`mt-4 grid gap-4 ${COLUMN_CLASSES}`}>
					{skeletonKeys.map((key) => (
						<div
							key={key}
							className={`photo-skeleton relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 ${TILE_ASPECT}`}
						/>
					))}
				</div>
			) : null}
			<p className="sr-only" role="status">
				{isAppending ? "Loading more photos" : ""}
			</p>
			{loadError ? (
				<div className="mt-4 flex items-center gap-2">
					<p className="text-xs text-neutral-400">{loadError}</p>
					<button
						type="button"
						onClick={() => void loadMorePhotos()}
						className="cursor-pointer rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-neutral-200 transition hover:bg-white/8 hover:text-white"
					>
						Try again
					</button>
				</div>
			) : null}
			<PhotoLightbox
				photos={lightboxPhotos}
				activeIndex={safeActiveIndex}
				onClose={close}
				onPrevious={goPrevious}
				onNext={goNext}
			/>
		</>
	);
}
