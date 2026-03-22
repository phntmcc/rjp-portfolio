"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { BentoCard } from "@/components/bento/bento-card";
import { PhotoExpandIcon } from "@/components/icons/photo-expand";
import { PhotoExifPanel } from "@/components/photography/photo-exif-panel";
import {
	type LightboxPhoto,
	PhotoLightbox,
} from "@/components/photography/photo-lightbox";
import type { HomePhotographyPhoto } from "@/lib/photography";

type PhotoCardProps = {
	className?: string;
	delay?: number;
	photo?: HomePhotographyPhoto;
};

export function PhotoCard({ className, delay = 0.12, photo }: PhotoCardProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const open = useCallback(() => setLightboxOpen(true), []);
	const close = useCallback(() => setLightboxOpen(false), []);

	const lightboxPhotos: LightboxPhoto[] = useMemo(() => {
		if (!photo) return [];
		return [
			{
				id: photo.id,
				src: photo.imageSrcLightbox,
				alt: `${photo.place}, ${photo.date}`,
				width: photo.width,
				height: photo.height,
				locationName: photo.place,
				shotAtLabel: photo.date,
				iso: photo.iso,
				aperture: photo.aperture,
				shutterSpeed: photo.shutterSpeed,
			},
		];
	}, [photo]);

	const hoverReveal =
		"opacity-0 transition-[max-height,opacity] duration-200 ease-out group-hover/bento:opacity-100";

	return (
		<BentoCard className={className} delay={delay}>
			<section
				id="photography"
				className="relative flex aspect-328/530 w-full min-h-[400px] flex-col justify-between overflow-hidden p-6 lg:aspect-auto lg:h-full lg:min-h-[530px]"
			>
				{photo ? (
					<button
						type="button"
						className="absolute inset-0 z-5 cursor-pointer border-0 bg-transparent p-0"
						aria-label={`View ${photo.place} photo full size`}
						onClick={open}
					/>
				) : null}

				<div className="pointer-events-none absolute inset-0 z-6">
					{photo ? (
						<Image
							src={photo.imageSrc}
							alt=""
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 328px"
							priority
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-neutral-950" />
					)}
					<div
						aria-hidden
						className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/75 to-transparent"
					/>
				</div>

				<div
					className={`pointer-events-none absolute right-6 top-6 z-20 max-h-0 overflow-hidden opacity-0 ${hoverReveal} group-hover/bento:max-h-12 group-hover/bento:opacity-100`}
				>
					<div
						className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.302)]"
						aria-hidden
					>
						<PhotoExpandIcon className="size-4 text-[#d4d4d4]" />
					</div>
				</div>

				<div className="pointer-events-none h-10 shrink-0" aria-hidden />
				<div className="pointer-events-none relative z-10 mt-auto flex flex-col gap-3">
					{photo ? (
						<div
							className={`flex max-h-0 flex-col gap-3 overflow-hidden opacity-0 ${hoverReveal} group-hover/bento:max-h-40 group-hover/bento:opacity-100`}
						>
							<PhotoExifPanel
								iso={photo.iso}
								aperture={photo.aperture}
								shutterSpeed={photo.shutterSpeed}
							/>
						</div>
					) : null}
					<div className="flex flex-col gap-1">
						<p className="font-serif text-2xl text-white">
							{photo ? photo.place : "Photography"}
						</p>
						<p className="text-xs text-neutral-400">
							{photo
								? photo.date
								: "Upload photos in admin to feature one here"}
						</p>
					</div>
				</div>
			</section>
			<PhotoLightbox
				photos={lightboxPhotos}
				activeIndex={lightboxOpen ? 0 : null}
				onClose={close}
			/>
		</BentoCard>
	);
}
