"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
	MasonryGallery,
	MasonryGalleryItem,
} from "@/components/gallery/masonry-gallery";
import {
	type LightboxPhoto,
	PhotoLightbox,
} from "@/components/photography/photo-lightbox";
import type { ProjectGalleryImage } from "@/content/projects";

type ProjectGalleryProps = {
	images: readonly ProjectGalleryImage[];
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const open = useCallback((index: number) => setActiveIndex(index), []);
	const close = useCallback(() => setActiveIndex(null), []);

	const goPrevious = useCallback(() => {
		setActiveIndex((current) => {
			if (current === null) return current;
			return (current - 1 + images.length) % images.length;
		});
	}, [images.length]);

	const goNext = useCallback(() => {
		setActiveIndex((current) => {
			if (current === null) return current;
			return (current + 1) % images.length;
		});
	}, [images.length]);

	if (images.length === 0) {
		return (
			<p className="text-sm text-neutral-500">
				Project images will be added shortly.
			</p>
		);
	}

	const lightboxPhotos: LightboxPhoto[] = images.map((image) => ({
		id: image.id,
		src: image.src,
		alt: image.alt,
		width: image.width,
		height: image.height,
		locationName: "",
		shotAtLabel: "",
	}));

	return (
		<>
			<MasonryGallery>
				{images.map((image, index) => (
					<MasonryGalleryItem key={image.id} delay={0.12 + index * 0.06}>
						<button
							type="button"
							onClick={() => open(index)}
							className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
							aria-label={`Open image ${index + 1} in full-size viewer`}
						>
							<Image
								src={image.src}
								alt={image.alt}
								width={image.width}
								height={image.height}
								unoptimized
								className="block h-auto w-full transition duration-300 ease-out group-hover:scale-[1.01]"
							/>
						</button>
					</MasonryGalleryItem>
				))}
			</MasonryGallery>
			<PhotoLightbox
				photos={lightboxPhotos}
				activeIndex={activeIndex}
				onClose={close}
				onPrevious={goPrevious}
				onNext={goNext}
				showDetails={false}
				useAspectRatioFrame={false}
			/>
		</>
	);
}
