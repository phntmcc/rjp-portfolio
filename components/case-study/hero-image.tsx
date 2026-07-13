"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type LightboxPhoto,
	PhotoLightbox,
} from "@/components/photography/photo-lightbox";

type HeroImageProps = {
	src: string;
	alt: string;
	caption: string;
};

const HERO_LIGHTBOX_WIDTH = 1920;
const HERO_LIGHTBOX_HEIGHT = 1080;

export function HeroImage({ src, alt, caption }: HeroImageProps) {
	const wrapRef = useRef<HTMLButtonElement>(null);
	const glowRef = useRef<HTMLDivElement>(null);
	const reduceMotionRef = useRef(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const openLightbox = useCallback(() => setLightboxOpen(true), []);
	const closeLightbox = useCallback(() => setLightboxOpen(false), []);

	useEffect(() => {
		reduceMotionRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
	}, []);

	const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
		const wrap = wrapRef.current;
		const glow = glowRef.current;
		if (!wrap || !glow || reduceMotionRef.current) return;

		const rect = wrap.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		wrap.style.setProperty("--hx", `${x}%`);
		wrap.style.setProperty("--hy", `${y}%`);
		glow.style.opacity = "1";
	};

	const handleLeave = () => {
		const glow = glowRef.current;
		if (!glow) return;
		glow.style.opacity = "0";
	};

	const lightboxPhotos: LightboxPhoto[] = [
		{
			id: src,
			src,
			alt,
			width: HERO_LIGHTBOX_WIDTH,
			height: HERO_LIGHTBOX_HEIGHT,
			locationName: "",
			shotAtLabel: "",
		},
	];

	return (
		<>
			<button
				type="button"
				ref={wrapRef}
				onClick={openLightbox}
				onMouseMove={handleMove}
				onMouseLeave={handleLeave}
				aria-label={`Open image: ${alt}`}
				className="group case-study-mount relative mt-14 block aspect-video w-full cursor-zoom-in overflow-hidden rounded-3xl border border-white/11 bg-[#141414] p-0 text-left [animation-delay:0.5s]"
			>
				<Image
					src={src}
					alt={alt}
					fill
					unoptimized
					priority
					sizes="(max-width: 1344px) 100vw, 1344px"
					className="object-cover brightness-105 contrast-105 saturate-110 transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03] motion-reduce:transform-none"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent via-35% to-transparent"
				/>
				<div
					ref={glowRef}
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out"
					style={{
						background:
							"radial-gradient(560px circle at var(--hx, 50%) var(--hy, 50%), rgba(255,255,255,0.09), transparent 60%)",
					}}
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute right-5 top-5 z-10 flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				>
					<ZoomIn className="size-4 text-[#d4d4d4]" />
				</div>
				<div className="pointer-events-none absolute bottom-5 left-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3.5 py-1.5 backdrop-blur-md">
					<span className="font-mono text-[10px] uppercase tracking-wide text-neutral-300">
						{caption}
					</span>
				</div>
			</button>
			<PhotoLightbox
				photos={lightboxPhotos}
				activeIndex={lightboxOpen ? 0 : null}
				onClose={closeLightbox}
				showDetails={false}
				useAspectRatioFrame={false}
			/>
		</>
	);
}
