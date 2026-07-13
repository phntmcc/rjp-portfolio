import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import type { CaseStudyConstraintsSection } from "@/content/case-studies/types";

type ConstraintsSectionProps = {
	section: CaseStudyConstraintsSection;
	index: string;
};

export function ConstraintsSection({
	section,
	index,
}: ConstraintsSectionProps) {
	if (section.items.length === 0) {
		return null;
	}

	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-20"
		>
			<ScrollReveal revealKey="constraints">
				<CaseStudySectionHeader
					index={index}
					label={section.label}
					className="mb-2.5"
				/>
				<p className="mb-3 max-w-[600px] text-sm leading-normal text-neutral-500">
					{section.intro ??
						"Every call below was made inside these walls. Read them first."}
				</p>
				<div className="flex flex-col">
					{section.items.map((constraint) => (
						<div
							key={constraint.label}
							className="grid grid-cols-1 items-baseline gap-4 border-b border-white/5 py-4 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1.2fr)]"
						>
							<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
								{constraint.label}
							</span>
							<span className="text-sm leading-normal text-neutral-200">
								{constraint.value}
							</span>
							<span className="text-sm leading-normal text-neutral-500">
								→ {constraint.consequence}
							</span>
						</div>
					))}
				</div>
			</ScrollReveal>
		</section>
	);
}
