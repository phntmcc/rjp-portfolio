import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import { ProjectGallery } from "@/components/projects/project-gallery";
import type { CaseStudyMediaSection } from "@/content/case-studies/types";

type MediaSectionProps = {
	section: CaseStudyMediaSection;
	index: string;
};

export function MediaSection({ section, index }: MediaSectionProps) {
	if (section.items.length === 0) {
		return null;
	}

	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-20"
		>
			<ScrollReveal revealKey="media">
				<CaseStudySectionHeader
					index={index}
					label={section.label}
					className="mb-6"
				/>
				{section.caption ? (
					<p className="mb-8 max-w-[600px] text-sm leading-relaxed text-neutral-400">
						{section.caption}
					</p>
				) : null}
				<ProjectGallery images={section.items} />
			</ScrollReveal>
		</section>
	);
}
