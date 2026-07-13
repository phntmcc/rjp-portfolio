import { CaseStudyLightboxImage } from "@/components/case-study/case-study-lightbox-image";
import type { CaseStudyMedia } from "@/content/case-studies/types";

const DEFAULT_DIMENSIONS = {
	landscape: { width: 2048, height: 1463 },
	portrait: { width: 1463, height: 2048 },
} as const;

type CaseStudyMediaFrameProps = {
	media: CaseStudyMedia;
	className?: string;
	priority?: boolean;
};

/** Shared framed image used by spotlight, features, and decision-style blocks. */
export function CaseStudyMediaFrame({
	media,
	className,
	priority,
}: CaseStudyMediaFrameProps) {
	const orientation = media.orientation ?? "landscape";
	const fallback = DEFAULT_DIMENSIONS[orientation];
	const width = media.width ?? fallback.width;
	const height = media.height ?? fallback.height;

	return (
		<CaseStudyLightboxImage
			src={media.src}
			alt={media.alt}
			width={width}
			height={height}
			priority={priority}
			className={className}
		/>
	);
}
