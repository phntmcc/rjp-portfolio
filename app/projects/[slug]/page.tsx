import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { TransitionLink } from "@/components/navigation/transition-link";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { getInternalProjectBySlug } from "@/content/projects";

type ProjectDetailPageProps = {
	params: Promise<{ slug: string }>;
};

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
