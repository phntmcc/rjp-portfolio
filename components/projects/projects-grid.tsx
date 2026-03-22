import { ProjectCard } from "@/components/projects/project-card";
import { projectsContent } from "@/content/projects";

export function ProjectsGrid() {
	const { items } = projectsContent;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{items.map((project, index) => (
				<ProjectCard
					key={project.id}
					project={project}
					delay={0.1 + index * 0.06}
					eagerImage={index === 0}
				/>
			))}
		</div>
	);
}
