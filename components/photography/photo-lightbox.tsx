"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PhotoExifPanel } from "@/components/photography/photo-exif-panel";
import {
	LIGHTBOX_CONTAINER_MAX_HEIGHT_CLASS,
	LIGHTBOX_CONTAINER_MAX_WIDTH_CLASS,
	LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS,
	LIGHTBOX_LAYER_Z_INDEX_CLASS,
} from "@/lib/layout-constants";

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
};

function LightboxImageFrame({ photo }: { photo: LightboxPhoto }) {
	const [imageReady, setImageReady] = useState(false);

	return (
		<div
			className={`relative inline-flex ${LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS} max-w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40`}
			style={{
				aspectRatio: `${photo.width} / ${photo.height}`,
			}}
		>
			<Image
				src={photo.src}
				alt={photo.alt}
				width={photo.width}
				height={photo.height}
				unoptimized
				loading="eager"
				fetchPriority="high"
				onLoad={() => setImageReady(true)}
				className={`h-auto ${LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS} w-auto max-w-full object-contain transition-opacity duration-200 ${imageReady ? "opacity-100" : "opacity-0"}`}
			/>
			{!imageReady ? (
				<div className="absolute inset-0 flex items-center justify-center bg-black/40">
					<div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
				</div>
			) : null}
		</div>
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
			className={`absolute flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/60 text-neutral-200 transition hover:bg-black/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${className}`}
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

	const preloadUrls = useMemo(() => {
		if (!activePhoto || activeIndex === null) return [];
		if (!canNavigate) return [activePhoto.src];
		const next = photos[(activeIndex + 1) % photos.length];
		const previous = photos[(activeIndex - 1 + photos.length) % photos.length];
		return [activePhoto.src, next.src, previous.src];
	}, [activePhoto, activeIndex, canNavigate, photos]);

	useEffect(() => {
		for (const url of preloadUrls) {
			const image = new window.Image();
			image.decoding = "async";
			image.src = url;
		}
	}, [preloadUrls]);

	if (!activePhoto || typeof document === "undefined") return null;

	return createPortal(
		<div
			className={`fixed inset-0 ${LIGHTBOX_LAYER_Z_INDEX_CLASS} flex items-center justify-center p-4 sm:p-8`}
			role="dialog"
			aria-modal="true"
			aria-label={`${activePhoto.locationName} full-size photo`}
		>
			<button
				type="button"
				className="absolute inset-0 border-0 bg-black/78 backdrop-blur-md"
				aria-label="Close image viewer"
				onClick={onClose}
			/>
			<div
				className={`relative z-10 flex ${LIGHTBOX_CONTAINER_MAX_HEIGHT_CLASS} w-full ${LIGHTBOX_CONTAINER_MAX_WIDTH_CLASS} items-center justify-center`}
			>
				{useAspectRatioFrame ? (
					<LightboxImageFrame key={activePhoto.id} photo={activePhoto} />
				) : (
					<Image
						key={activePhoto.id}
						src={activePhoto.src}
						alt={activePhoto.alt}
						width={activePhoto.width}
						height={activePhoto.height}
						unoptimized
						loading="eager"
						fetchPriority="high"
						className={`h-auto ${LIGHTBOX_IMAGE_MAX_HEIGHT_CLASS} w-auto max-w-full rounded-xl border border-white/10 object-contain`}
					/>
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
				<div className="absolute bottom-2 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2">
					<p className="text-xs text-neutral-200">
						{(activeIndex ?? 0) + 1} / {photos.length}
					</p>
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
			</div>
		</div>,
		document.body,
	);
}
