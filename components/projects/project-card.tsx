import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { BentoCard } from "@/components/bento/bento-card";
import { TransitionLink } from "@/components/navigation/transition-link";
import type { ProjectItem } from "@/content/projects";

type ProjectCardProps = {
	project: ProjectItem;
	delay?: number;
	eagerImage?: boolean;
};

export function ProjectCard({
	project,
	delay = 0,
	eagerImage = false,
}: ProjectCardProps) {
	const ctaLabel =
		project.ctaLabel ??
		(project.linkType === "internal" ? "View images" : "View project");
	const linkAriaLabel =
		project.linkType === "internal"
			? `View ${project.name} images`
			: `Open ${project.name} project`;

	return (
		<BentoCard delay={delay}>
			<article className="relative flex h-full min-h-[310px] flex-col gap-4 bg-white/3 p-5">
				<TransitionLink
					href={project.href}
					aria-label={linkAriaLabel}
					className="absolute inset-0 z-20 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
					{...(project.linkType === "external" && {
						target: "_blank",
						rel: "noopener noreferrer",
					})}
				/>
				<div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/3">
					<Image
						src={project.thumbSrc}
						alt={project.thumbAlt}
						fill
						unoptimized
						sizes="(max-width: 768px) 100vw, 50vw"
						loading={eagerImage ? "eager" : "lazy"}
						fetchPriority={eagerImage ? "high" : "auto"}
						className="object-cover brightness-105 contrast-110 saturate-120 transition duration-500 ease-out group-hover/bento:scale-105"
					/>
				</div>
				<div className="space-y-2">
					<h2 className="font-serif text-2xl text-white">{project.name}</h2>
					<p className="text-sm leading-relaxed text-neutral-400">
						{project.summary}
					</p>
					<div className="flex flex-wrap gap-1.5 pt-1">
						{project.tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-neutral-400"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
				<div className="mt-auto">
					<div className="inline-flex items-center gap-1.5 text-sm text-neutral-300 underline-offset-4 transition group-hover/bento:text-white group-hover/bento:underline">
						{ctaLabel}
						<ArrowUpRight className="size-3.5 shrink-0" />
					</div>
				</div>
			</article>
		</BentoCard>
	);
}
