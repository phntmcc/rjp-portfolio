import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { projectsContent } from "@/content/projects";
import { PAGE_BOTTOM_PADDING_CLASS } from "@/lib/layout-constants";

export const metadata: Metadata = {
	title: "Projects",
	description: projectsContent.subhead,
	alternates: {
		canonical: "/projects",
	},
	openGraph: {
		title: "Projects | Robbie Patterson",
		description: projectsContent.subhead,
		url: "/projects",
	},
	twitter: {
		title: "Projects | Robbie Patterson",
		description: projectsContent.subhead,
	},
};

export default function ProjectsPage() {
	const { headline, subhead } = projectsContent;

	return (
		<main className={`projects-page ${PAGE_BOTTOM_PADDING_CLASS}`}>
			<PageHeader title={headline} description={subhead} />
			<ProjectsGrid />
		</main>
	);
}
