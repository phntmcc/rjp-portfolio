import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import type { CaseStudyBriefSection } from "@/content/case-studies/types";

type BriefSectionProps = {
	section: CaseStudyBriefSection;
	index: string;
};

export function BriefSection({ section, index }: BriefSectionProps) {
	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-12"
		>
			<ScrollReveal revealKey="brief">
				<CaseStudySectionHeader
					index={index}
					label={section.label}
					className="mb-6"
				/>
				<p className="max-w-[760px] font-serif text-[clamp(24px,2.3vw,32px)] leading-snug text-white">
					{section.pull}
				</p>
				<div className="mt-8 grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
					<div className="flex flex-col gap-2">
						<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
							The situation
						</span>
						<p className="text-sm leading-relaxed text-neutral-400">
							{section.situation}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
							The ask
						</span>
						<p className="text-sm leading-relaxed text-neutral-400">
							{section.ask}
						</p>
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}
