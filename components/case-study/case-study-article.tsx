import { BriefSection } from "@/components/case-study/brief-section";
import { ConstraintsSection } from "@/components/case-study/constraints-section";
import { DecisionsSection } from "@/components/case-study/decisions-section";
import { FeaturesSection } from "@/components/case-study/features-section";
import { MediaSection } from "@/components/case-study/media-section";
import { OutcomeSection } from "@/components/case-study/outcome-section";
import { SpotlightSection } from "@/components/case-study/spotlight-section";
import {
	buildSectionManifest,
	type CaseStudy,
} from "@/content/case-studies/types";

type CaseStudyArticleProps = {
	caseStudy: CaseStudy;
};

/** Renders a case study from its ordered `sections` blocks. */
export function CaseStudyArticle({ caseStudy }: CaseStudyArticleProps) {
	const manifest = buildSectionManifest(caseStudy);

	return (
		<>
			{caseStudy.sections.map((section, position) => {
				const index = manifest[position]?.index ?? "01";

				switch (section.type) {
					case "brief":
						return (
							<BriefSection key={section.id} section={section} index={index} />
						);
					case "constraints":
						return (
							<ConstraintsSection
								key={section.id}
								section={section}
								index={index}
							/>
						);
					case "decisions":
						return (
							<DecisionsSection
								key={section.id}
								section={section}
								index={index}
							/>
						);
					case "spotlight":
						return (
							<SpotlightSection
								key={section.id}
								section={section}
								index={index}
							/>
						);
					case "features":
						return (
							<FeaturesSection
								key={section.id}
								section={section}
								index={index}
							/>
						);
					case "media":
						return (
							<MediaSection key={section.id} section={section} index={index} />
						);
					case "outcome":
						return (
							<OutcomeSection
								key={section.id}
								section={section}
								index={index}
							/>
						);
					default:
						return null;
				}
			})}
		</>
	);
}
