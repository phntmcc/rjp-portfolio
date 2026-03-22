import { PageHeader } from "@/components/layout/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { projectsContent } from "@/content/projects";
import { PAGE_BOTTOM_PADDING_CLASS } from "@/lib/layout-constants";

export default function ProjectsPage() {
	const { headline, subhead } = projectsContent;

	return (
		<main className={`projects-page ${PAGE_BOTTOM_PADDING_CLASS}`}>
			<PageHeader title={headline} description={subhead} />
			<ProjectsGrid />
		</main>
	);
}
