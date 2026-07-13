import type { Metadata } from "next";
import { AmbientBackground } from "@/components/case-study/ambient-background";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectShowcase } from "@/components/projects/project-showcase";
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
		images: [
			{
				url: "/images/Opengraph.png",
				width: 1200,
				height: 630,
				alt: "Robbie Patterson social preview",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Projects | Robbie Patterson",
		description: projectsContent.subhead,
		images: ["/images/Opengraph.png"],
	},
};

export default function ProjectsPage() {
	const { headline, subhead } = projectsContent;

	return (
		<>
			<AmbientBackground />
			<main
				className={`projects-page relative z-1 ${PAGE_BOTTOM_PADDING_CLASS}`}
			>
				<PageHeader
					eyebrow="Selected work"
					title={headline}
					description={subhead}
				/>
				<div className="mt-6 lg:mt-10">
					<ProjectShowcase />
				</div>
			</main>
		</>
	);
}
