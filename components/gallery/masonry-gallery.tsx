import type { CSSProperties, ReactNode } from "react";

type MasonryGalleryProps = {
	children: ReactNode;
	className?: string;
};

type MasonryGalleryItemProps = {
	children: ReactNode;
	delay: number;
	animate?: boolean;
	className?: string;
};

export function MasonryGallery({ children, className }: MasonryGalleryProps) {
	return (
		<div
			className={`columns-1 gap-4 md:columns-2 xl:columns-3 ${className ?? ""}`}
		>
			{children}
		</div>
	);
}

export function MasonryGalleryItem({
	children,
	delay,
	animate = true,
	className,
}: MasonryGalleryItemProps) {
	return (
		<figure
			className={`${animate ? "animate-bento-in" : ""} mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/3 ${className ?? ""}`}
			style={
				{
					"--bento-delay": animate ? `${delay}s` : "0s",
				} as CSSProperties
			}
		>
			{children}
		</figure>
	);
}
