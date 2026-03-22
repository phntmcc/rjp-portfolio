"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MasonryGalleryItem } from "@/components/gallery/masonry-gallery";
import { PhotoExpandIcon } from "@/components/icons/photo-expand";
import { PhotoExifPanel } from "@/components/photography/photo-exif-panel";
import {
	type LightboxPhoto,
	PhotoLightbox,
} from "@/components/photography/photo-lightbox";
import type { PhotographyLocation, PhotographyPhoto } from "@/lib/photography";
import { PHOTOGRAPHY_PAGE_SIZE } from "@/lib/photography-constants";

type PhotographyBoardProps = {
	initialPhotos: PhotographyPhoto[];
	initialHasMore: boolean;
	locations: PhotographyLocation[];
	activeLocation?: string;
};

function buildLocationHref(slug?: string) {
	return slug ? `/photography?location=${slug}` : "/photography";
}

function getColumnCount() {
	if (typeof window === "undefined") return 3;
	if (window.innerWidth >= 1280) return 3;
	if (window.innerWidth >= 768) return 2;
	return 1;
}

export function PhotographyBoard({
	initialPhotos,
	initialHasMore,
	locations,
	activeLocation,
}: PhotographyBoardProps) {
	const hoverReveal =
		"opacity-0 transition-[max-height,opacity] duration-200 ease-out group-hover:opacity-100";

	const [selectedLocation, setSelectedLocation] = useState(
		activeLocation ?? "",
	);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [photos, setPhotos] = useState(initialPhotos);
	const [columnCount, setColumnCount] = useState(getColumnCount);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [nextOffset, setNextOffset] = useState(initialPhotos.length);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [animatedCount, setAnimatedCount] = useState(initialPhotos.length);
	const requestVersionRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const locationQueryParam = selectedLocation || undefined;

	useEffect(() => {
		const syncColumns = () => setColumnCount(getColumnCount());
		syncColumns();
		window.addEventListener("resize", syncColumns);
		return () => window.removeEventListener("resize", syncColumns);
	}, []);

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
				setAnimatedCount(payload.photos.length);
			}
			setHasMore(payload.hasMore);
			setNextOffset(payload.nextOffset);
			setLoadError(null);
		},
		[],
	);

	const loadMorePhotos = useCallback(async () => {
		if (isLoadingMore || !hasMore) return;
		setIsLoadingMore(true);
		try {
			await fetchPhotosPage({
				locationSlug: locationQueryParam,
				offset: nextOffset,
				append: true,
			});
		} catch {
			setLoadError("Could not load more photos.");
		} finally {
			setIsLoadingMore(false);
		}
	}, [fetchPhotosPage, hasMore, isLoadingMore, locationQueryParam, nextOffset]);

	useEffect(() => {
		if (!hasMore || isLoadingMore) return;
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
	}, [hasMore, isLoadingMore, loadMorePhotos]);

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

			const nextHref = buildLocationHref(next || undefined);
			const applyFilter = () => {
				setSelectedLocation(next);
				setActiveIndex(null);
				window.history.replaceState({}, "", nextHref);
			};

			const supportsViewTransitions = Boolean(
				typeof document !== "undefined" &&
					"startViewTransition" in document &&
					typeof (
						document as Document & {
							startViewTransition: (callback: () => void) => void;
						}
					).startViewTransition === "function",
			);

			if (supportsViewTransitions) {
				(
					document as Document & {
						startViewTransition: (callback: () => void) => void;
					}
				).startViewTransition(applyFilter);
			} else {
				applyFilter();
			}

			requestVersionRef.current += 1;
			setIsLoadingMore(true);
			try {
				await fetchPhotosPage({
					locationSlug: next || undefined,
					offset: 0,
					append: false,
				});
			} catch {
				setPhotos([]);
				setHasMore(true);
				setNextOffset(0);
				setLoadError("Could not load photos for this location.");
			} finally {
				setIsLoadingMore(false);
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

	const photoColumns = useMemo(() => {
		const columns = Array.from({ length: columnCount }, (_, columnNumber) => {
			return {
				id: `column-${columnNumber + 1}`,
				height: 0,
				items: [] as Array<{ photo: PhotographyPhoto; index: number }>,
			};
		});

		for (const [index, photo] of photos.entries()) {
			let targetColumn = 0;
			for (let i = 1; i < columns.length; i += 1) {
				if (columns[i].height < columns[targetColumn].height) {
					targetColumn = i;
				}
			}

			columns[targetColumn].items.push({ photo, index });
			columns[targetColumn].height += photo.height / photo.width;
		}

		return columns;
	}, [columnCount, photos]);

	return (
		<>
			<div className="mb-6 flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={() => void handleFilterSelect()}
					className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ${!selectedLocation ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-white/3 text-neutral-300 hover:bg-white/8 hover:text-white"}`}
				>
					All
				</button>
				{locations.map((location) => (
					<button
						type="button"
						onClick={() => void handleFilterSelect(location.slug)}
						key={location.slug}
						className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ${selectedLocation === location.slug ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-white/3 text-neutral-300 hover:bg-white/8 hover:text-white"}`}
					>
						{location.name}
					</button>
				))}
			</div>

			{photos.length === 0 ? (
				<div className="rounded-2xl border border-white/10 bg-white/3 p-6">
					<p className="text-sm text-neutral-400">
						No photos found for this location yet.
					</p>
				</div>
			) : (
				<div
					className={`grid gap-4 ${
						columnCount === 1
							? "grid-cols-1"
							: columnCount === 2
								? "grid-cols-2"
								: "grid-cols-3"
					}`}
				>
					{photoColumns.map((column) => (
						<div
							key={`${selectedLocation || "all"}-${column.id}`}
							className="flex flex-col gap-4"
						>
							{column.items.map(({ photo, index }) => (
								<MasonryGalleryItem
									key={`${selectedLocation || "all"}-${photo.id}`}
									className="group"
									animate={index < animatedCount}
									delay={0.04 + index * 0.02}
								>
									<button
										type="button"
										onClick={() => handleOpenPhoto(photo.id)}
										className="relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
										aria-label={`Open ${photo.locationName} photo in full-size viewer`}
									>
										<Image
											src={photo.thumbUrl}
											alt={photo.title ?? `${photo.locationName} photo`}
											width={photo.width}
											height={photo.height}
											unoptimized
											placeholder={photo.blurDataUrl ? "blur" : "empty"}
											blurDataURL={photo.blurDataUrl ?? undefined}
											className="block h-auto w-full transition duration-300 ease-out group-hover:scale-[1.01]"
										/>
										<div
											aria-hidden
											className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/75 to-transparent"
										/>

										<div
											className={`pointer-events-none absolute right-3 top-3 z-10 max-h-0 overflow-hidden ${hoverReveal} group-hover:max-h-12`}
										>
											<div
												className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.302)]"
												aria-hidden
											>
												<PhotoExpandIcon className="size-4 text-[#d4d4d4]" />
											</div>
										</div>

										<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3">
											<PhotoExifPanel
												iso={photo.iso}
												aperture={photo.aperture}
												shutterSpeed={photo.shutterSpeed}
												className={`mb-2 max-h-0 overflow-hidden ${hoverReveal} group-hover:max-h-40`}
											/>
											<p
												className={`max-h-0 overflow-hidden font-serif text-xl text-white ${hoverReveal} group-hover:max-h-12`}
											>
												{photo.locationName}
											</p>
											<p
												className={`max-h-0 overflow-hidden text-xs text-neutral-300 ${hoverReveal} group-hover:max-h-8`}
											>
												{photo.shotAtLabel}
											</p>
										</div>
									</button>
								</MasonryGalleryItem>
							))}
						</div>
					))}
				</div>
			)}
			<div ref={sentinelRef} aria-hidden className="h-4" />
			{isLoadingMore ? (
				<p className="mt-4 text-xs text-neutral-400">Loading more photos...</p>
			) : null}
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
