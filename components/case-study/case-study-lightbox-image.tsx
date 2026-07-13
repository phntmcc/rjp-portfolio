"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import {
	type LightboxPhoto,
	PhotoLightbox,
} from "@/components/photography/photo-lightbox";

type CaseStudyLightboxImageProps = {
	src: string;
	alt: string;
	width: number;
	height: number;
	priority?: boolean;
	className?: string;
	imageClassName?: string;
};

export function CaseStudyLightboxImage({
	src,
	alt,
	width,
	height,
	priority,
	className,
	imageClassName,
}: CaseStudyLightboxImageProps) {
	const [open, setOpen] = useState(false);

	const openLightbox = useCallback(() => setOpen(true), []);
	const closeLightbox = useCallback(() => setOpen(false), []);

	const lightboxPhotos: LightboxPhoto[] = [
		{
			id: src,
			src,
			alt,
			width,
			height,
			locationName: "",
			shotAtLabel: "",
		},
	];

	return (
		<>
			<button
				type="button"
				onClick={openLightbox}
				aria-label={`Open image: ${alt}`}
				className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/11 bg-[#141414] p-0 text-left ${className ?? ""}`}
			>
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					unoptimized
					priority={priority}
					className={`block h-auto w-full brightness-105 contrast-105 ${imageClassName ?? ""}`}
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				>
					<ZoomIn className="size-4 text-[#d4d4d4]" />
				</div>
			</button>
			<PhotoLightbox
				photos={lightboxPhotos}
				activeIndex={open ? 0 : null}
				onClose={closeLightbox}
				showDetails={false}
				useAspectRatioFrame={false}
			/>
		</>
	);
}
