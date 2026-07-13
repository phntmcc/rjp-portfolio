import { DecisionBlock } from "@/components/case-study/decision-block";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import type { CaseStudyDecisionsSection } from "@/content/case-studies/types";

type DecisionsSectionProps = {
	section: CaseStudyDecisionsSection;
	index: string;
};

export function DecisionsSection({ section, index }: DecisionsSectionProps) {
	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-20"
		>
			<CaseStudySectionHeader
				index={index}
				label={section.label}
				className="mb-2.5"
			/>
			{section.items.map((decision) => (
				<DecisionBlock key={decision.n} decision={decision} />
			))}
		</section>
	);
}
