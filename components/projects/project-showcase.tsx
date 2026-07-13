import { ProjectShowcaseRow } from "@/components/projects/project-showcase-row";
import {
	getCaseStudyBySlug,
	getCaseStudyHeadlineMetric,
	getCaseStudyRoleTags,
} from "@/content/case-studies";
import { projectsContent } from "@/content/projects";

export function ProjectShowcase() {
	const { items } = projectsContent;

	return (
		<div className="flex flex-col gap-20 lg:gap-28">
			{items.map((project, index) => {
				const caseStudy = getCaseStudyBySlug(project.slug);
				const metric = getCaseStudyHeadlineMetric(project.slug);
				const roleTags = getCaseStudyRoleTags(project.slug);

				return (
					<ProjectShowcaseRow
						key={project.id}
						project={project}
						index={index}
						heroSrc={caseStudy?.hero.src ?? project.thumbSrc}
						heroAlt={caseStudy?.hero.alt ?? project.thumbAlt}
						tagline={caseStudy?.tagline ?? project.summary}
						accent={caseStudy?.accent}
						metric={metric}
						roleTags={roleTags.length > 0 ? roleTags : project.tags}
					/>
				);
			})}
		</div>
	);
}
