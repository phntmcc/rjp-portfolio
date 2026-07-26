"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { PhotoExifPanel } from "@/components/photography/photo-exif-panel";
import { PhotoPicture } from "@/components/photography/photo-picture";
import {
	LIGHTBOX_CONTAINER_MAX_HEIGHT_CLASS,
	LIGHTBOX_CONTAINER_MAX_WIDTH_CLASS,
	LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS,
	LIGHTBOX_LAYER_Z_INDEX_CLASS,
} from "@/lib/layout-constants";
import { buildAvifSrcSet, type PhotoVariants } from "@/lib/photo-variants";
import { GRID_VARIANT_WIDTHS } from "@/lib/photography-constants";

export type LightboxPhoto = {
	id: string;
	src: string;
	alt: string;
	width: number;
	height: number;
	locationName: string;
	shotAtLabel: string;
	iso?: string | null;
	aperture?: string | null;
	shutterSpeed?: string | null;
	thumbUrl?: string | null;
	blurDataUrl?: string | null;
	variants?: PhotoVariants | null;
};

/**
 * Pinned to the narrowest rung at every DPR. Without the cap a 2x or 3x device
 * selects a wider one, which defeats the point: this layer exists to reuse the
 * bytes the grid already cached, not to start a fresh download.
 */
const PREVIEW_PICTURE_SOURCES = [
	{
		sizes: `${GRID_VARIANT_WIDTHS[0]}px`,
		maxWidth: GRID_VARIANT_WIDTHS[0],
	},
] as const;

/**
 * The frame is capped at both 95vh and 95vw, so landscape shots are
 * height-constrained. A bare `95vw` would make the browser pick a rung far
 * wider than the image is ever painted.
 *
 * Paired with `aspect-ratio` this also makes the box deterministic before any
 * bytes arrive: the derived height is `min(95vw * H/W, 95vh)`, so the 95vh cap
 * can never bind, and on narrow screens `max-w-full` clamps the width with the
 * ratio recomputing the height.
 */
function lightboxFrameWidth(photo: LightboxPhoto) {
	return `min(95vw, calc(95vh * ${photo.width} / ${photo.height}))`;
}

/**
 * Declares twice the painted width on purpose. Left honest, a 1x display picks
 * the rung matched to the frame and paints it 1:1, which reads soft on a large
 * monitor; doubling makes it reach for the next rung up instead. Doubling both
 * terms is equivalent to doubling the result, since `min` distributes over a
 * positive scalar. Where the ladder is already exhausted this is a no-op.
 */
function lightboxSizes(photo: LightboxPhoto) {
	return `min(190vw, calc(190vh * ${photo.width} / ${photo.height}))`;
}

function LightboxImageFrame({
	photo,
	onClose,
}: {
	photo: LightboxPhoto;
	onClose: () => void;
}) {
	const [imageReady, setImageReady] = useState(false);
	const previewSrc = photo.thumbUrl ?? null;
	const handleReady = useCallback(() => setImageReady(true), []);
	const fadeOut = imageReady ? "opacity-0" : "opacity-100";

	return (
		<button
			type="button"
			onClick={onClose}
			aria-label="Close image viewer"
			className={`pointer-events-auto relative flex ${LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS} max-w-full cursor-zoom-out items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 p-0`}
			style={{
				aspectRatio: `${photo.width} / ${photo.height}`,
				width: lightboxFrameWidth(photo),
			}}
		>
			{photo.blurDataUrl ? (
				<div
					aria-hidden
					className={`absolute inset-0 scale-105 bg-cover bg-center blur-sm transition-opacity duration-300 ${fadeOut}`}
					style={{ backgroundImage: `url("${photo.blurDataUrl}")` }}
				/>
			) : null}
			{previewSrc ? (
				/* Kept unscaled so it lines up with the full image and nothing shifts
				   when the two swap. */
				<PhotoPicture
					src={previewSrc}
					alt=""
					aria-hidden
					width={photo.width}
					height={photo.height}
					sizes={`${GRID_VARIANT_WIDTHS[0]}px`}
					sources={PREVIEW_PICTURE_SOURCES}
					variantRole="grid"
					variants={photo.variants ?? null}
					layout="fill"
					className={`object-contain blur-xs transition-opacity duration-300 ${fadeOut}`}
				/>
			) : null}
			<PhotoPicture
				src={photo.src}
				alt={photo.alt}
				width={photo.width}
				height={photo.height}
				sizes={lightboxSizes(photo)}
				variantRole="display"
				variants={photo.variants ?? null}
				priority
				layout="fill"
				onReady={handleReady}
				className={`object-contain transition-opacity duration-200 ${imageReady ? "opacity-100" : "opacity-0"}`}
			/>
			{!previewSrc && !photo.blurDataUrl && !imageReady ? (
				<div className="absolute inset-0 flex items-center justify-center bg-black/40">
					<div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
				</div>
			) : null}
		</button>
	);
}

type PhotoLightboxProps = {
	photos: LightboxPhoto[];
	activeIndex: number | null;
	onClose: () => void;
	onPrevious?: () => void;
	onNext?: () => void;
	showDetails?: boolean;
	useAspectRatioFrame?: boolean;
};

type LightboxControlButtonProps = {
	onClick: () => void;
	ariaLabel: string;
	className: string;
	icon: ReactNode;
};

function LightboxControlButton({
	onClick,
	ariaLabel,
	className,
	icon,
}: LightboxControlButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`pointer-events-auto absolute flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/60 text-neutral-200 transition hover:bg-black/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${className}`}
			aria-label={ariaLabel}
		>
			{icon}
		</button>
	);
}

export function PhotoLightbox({
	photos,
	activeIndex,
	onClose,
	onPrevious,
	onNext,
	showDetails = true,
	useAspectRatioFrame = true,
}: PhotoLightboxProps) {
	const activePhoto = activeIndex === null ? null : photos[activeIndex];
	const canNavigate = Boolean(onPrevious && onNext && photos.length > 1);

	useEffect(() => {
		if (activeIndex === null || !activePhoto) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
			if (event.key === "ArrowLeft" && canNavigate) onPrevious?.();
			if (event.key === "ArrowRight" && canNavigate) onNext?.();
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [activeIndex, activePhoto, canNavigate, onClose, onNext, onPrevious]);

	const preloadTargets = useMemo(() => {
		if (!activePhoto || activeIndex === null || !canNavigate) return [];
		const next = photos[(activeIndex + 1) % photos.length];
		const previous = photos[(activeIndex - 1 + photos.length) % photos.length];
		return [next, previous].filter(
			(photo, index, list) =>
				photo.id !== activePhoto.id &&
				list.findIndex((item) => item.id === photo.id) === index,
		);
	}, [activePhoto, activeIndex, canNavigate, photos]);

	if (!activePhoto || typeof document === "undefined") return null;

	const showCount = photos.length > 1;
	const showFooter = showCount || showDetails;

	return createPortal(
		<div
			className={`fixed inset-0 ${LIGHTBOX_LAYER_Z_INDEX_CLASS} flex items-center justify-center p-4 sm:p-8`}
			role="dialog"
			aria-modal="true"
			aria-label={`${activePhoto.locationName} full-size photo`}
		>
			{/* `type` lets browsers without AVIF skip the hint instead of fetching
			    bytes they cannot decode. */}
			{preloadTargets.map((photo) => {
				const srcSet = buildAvifSrcSet(photo.variants ?? null, "display");
				return srcSet ? (
					<link
						key={photo.id}
						rel="preload"
						as="image"
						type="image/avif"
						imageSrcSet={srcSet}
						imageSizes={lightboxSizes(photo)}
					/>
				) : (
					<link key={photo.id} rel="preload" as="image" href={photo.src} />
				);
			})}
			<button
				type="button"
				className="lightbox-backdrop-in absolute inset-0 border-0 bg-black/78 backdrop-blur-md"
				aria-label="Close image viewer"
				onClick={onClose}
			/>
			<div
				className={`lightbox-magnify pointer-events-none relative z-10 flex ${LIGHTBOX_CONTAINER_MAX_HEIGHT_CLASS} w-full ${LIGHTBOX_CONTAINER_MAX_WIDTH_CLASS} items-center justify-center`}
			>
				{useAspectRatioFrame ? (
					<LightboxImageFrame
						key={activePhoto.id}
						photo={activePhoto}
						onClose={onClose}
					/>
				) : (
					<button
						type="button"
						key={activePhoto.id}
						onClick={onClose}
						aria-label="Close image viewer"
						className="pointer-events-auto relative inline-flex max-w-full cursor-zoom-out border-0 bg-transparent p-0"
					>
						<PhotoPicture
							src={activePhoto.src}
							alt={activePhoto.alt}
							width={activePhoto.width}
							height={activePhoto.height}
							sizes={lightboxSizes(activePhoto)}
							variantRole="display"
							variants={activePhoto.variants ?? null}
							priority
							layout="intrinsic"
							className={`${LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS} rounded-xl border border-white/10 object-contain`}
						/>
					</button>
				)}
				{canNavigate ? (
					<>
						<LightboxControlButton
							onClick={() => onPrevious?.()}
							className="left-2 top-1/2 -translate-y-1/2"
							ariaLabel="Previous image"
							icon={<ChevronLeft className="size-5" />}
						/>
						<LightboxControlButton
							onClick={() => onNext?.()}
							className="right-2 top-1/2 -translate-y-1/2"
							ariaLabel="Next image"
							icon={<ChevronRight className="size-5" />}
						/>
					</>
				) : null}
				<LightboxControlButton
					onClick={onClose}
					className="right-2 top-2"
					ariaLabel="Close image viewer"
					icon={<X className="size-5" />}
				/>
				{showFooter ? (
					<div className="pointer-events-auto absolute bottom-2 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2">
						{showCount ? (
							<p className="text-xs text-neutral-200">
								{(activeIndex ?? 0) + 1} / {photos.length}
							</p>
						) : null}
						{showDetails ? (
							<>
								<p className="text-xs text-neutral-300">
									{activePhoto.locationName} · {activePhoto.shotAtLabel}
								</p>
								<PhotoExifPanel
									iso={activePhoto.iso}
									aperture={activePhoto.aperture}
									shutterSpeed={activePhoto.shutterSpeed}
								/>
							</>
						) : null}
					</div>
				) : null}
			</div>
		</div>,
		document.body,
	);
}
