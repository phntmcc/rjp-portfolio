import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { TransitionLink } from "@/components/navigation/transition-link";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { getInternalProjectBySlug, projectsContent } from "@/content/projects";

type ProjectDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return projectsContent.items
		.filter((item) => item.linkType === "internal")
		.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
	params,
}: ProjectDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = getInternalProjectBySlug(slug);

	if (!project) {
		return {
			title: "Project not found",
			description: "The requested project could not be found.",
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	return {
		title: project.name,
		description: project.summary,
		alternates: {
			canonical: project.href,
		},
		openGraph: {
			title: `${project.name} | Robbie Patterson`,
			description: project.summary,
			url: project.href,
			type: "article",
			images: [
				{
					url: project.thumbSrc,
					alt: project.thumbAlt,
				},
			],
		},
		twitter: {
			title: `${project.name} | Robbie Patterson`,
			description: project.summary,
			images: [project.thumbSrc],
		},
	};
}

export default async function ProjectDetailPage({
	params,
}: ProjectDetailPageProps) {
	const { slug } = await params;
	const project = getInternalProjectBySlug(slug);

	if (!project) {
		notFound();
	}

	return (
		<main className="space-y-6">
			<div className="animate-resume-in space-y-3">
				<TransitionLink
					href="/projects"
					className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-300"
				>
					<ArrowLeft className="size-4 shrink-0" />
					All projects
				</TransitionLink>
				<PageHeader
					eyebrow="Project"
					title={project.name}
					description={project.intro}
					className="mb-0 space-y-2"
				/>
			</div>
			<ProjectGallery images={project.gallery} />
		</main>
	);
}
