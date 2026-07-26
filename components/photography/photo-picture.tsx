"use client";

import { useCallback, useState } from "react";
import {
	buildAvifSrcSet,
	type PhotoVariants,
	type VariantRole,
} from "@/lib/photo-variants";

/**
 * One `<source>` in the ladder. `media` scopes it to a breakpoint, and
 * `maxWidth` trims the rungs it may choose from, which is how a wide rung can be
 * offered to desktop without a 3x phone pulling it into a much smaller slot.
 */
export type PhotoPictureSource = {
	/** Omit on the last entry so it acts as the unconditional fallback. */
	media?: string;
	sizes: string;
	maxWidth?: number;
};

type PhotoPictureProps = {
	/** JPEG fallback, used directly by browsers without AVIF support. */
	src: string;
	alt: string;
	width: number;
	height: number;
	sizes: string;
	/** Overrides the single default source built from `sizes`. */
	sources?: readonly PhotoPictureSource[];
	variantRole: VariantRole;
	variants: PhotoVariants | null;
	blurDataUrl?: string | null;
	priority?: boolean;
	/**
	 * `responsive` fills the container width, `fill` covers the nearest
	 * positioned ancestor, `intrinsic` lets the image size itself within its box,
	 * and `cover` fills a box whose height is set by something else.
	 */
	layout?: PhotoPictureLayout;
	className?: string;
	onReady?: () => void;
	"aria-hidden"?: boolean;
};

type PhotoPictureLayout = "responsive" | "fill" | "intrinsic" | "cover";

const LAYOUT_CLASS: Record<PhotoPictureLayout, string> = {
	responsive: "block h-auto w-full",
	fill: "absolute inset-0 h-full w-full",
	intrinsic: "block h-auto w-auto max-w-full",
	cover: "block h-full w-full object-cover",
};

/**
 * Serves a pre-generated AVIF ladder with a JPEG fallback. Deliberately not
 * `next/image`: these are already-optimised Supabase objects, so the optimiser
 * was bypassed with `unoptimized` anyway, and `<picture>` is the only way to
 * offer a real per-format fallback.
 */
export function PhotoPicture({
	src,
	alt,
	width,
	height,
	sizes,
	sources,
	variantRole,
	variants,
	blurDataUrl,
	priority = false,
	layout = "responsive",
	className,
	onReady,
	"aria-hidden": ariaHidden,
}: PhotoPictureProps) {
	const [loaded, setLoaded] = useState(false);
	const avifSources = (sources ?? [{ sizes }]).flatMap((source) => {
		const srcSet = buildAvifSrcSet(variants, variantRole, source.maxWidth);
		return srcSet ? [{ ...source, srcSet }] : [];
	});

	const handleLoaded = useCallback(() => {
		setLoaded(true);
		onReady?.();
	}, [onReady]);

	// A cached image can finish decoding before React attaches its handler, in
	// which case `onLoad` never fires and the placeholder would stay on screen.
	const imageRef = useCallback(
		(node: HTMLImageElement | null) => {
			if (node?.complete) handleLoaded();
		},
		[handleLoaded],
	);

	return (
		<picture>
			{avifSources.map((source) => (
				<source
					key={source.media ?? "default"}
					type="image/avif"
					media={source.media}
					srcSet={source.srcSet}
					sizes={source.sizes}
				/>
			))}
			<img
				ref={imageRef}
				src={src}
				alt={alt}
				width={width}
				height={height}
				sizes={sizes}
				loading={priority ? "eager" : "lazy"}
				fetchPriority={priority ? "high" : "auto"}
				decoding="async"
				aria-hidden={ariaHidden}
				onLoad={handleLoaded}
				className={`${LAYOUT_CLASS[layout]} ${className ?? ""}`}
				style={
					loaded || !blurDataUrl
						? undefined
						: {
								backgroundImage: `url("${blurDataUrl}")`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}
				}
			/>
		</picture>
	);
}
