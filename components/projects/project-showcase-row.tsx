import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/navigation/transition-link";
import { RevealOnScroll } from "@/components/projects/reveal-on-scroll";
import { Tag } from "@/components/ui/tag";
import type { CaseStudyMetric } from "@/content/case-studies";
import type { ProjectItem } from "@/content/projects";

type ProjectShowcaseRowProps = {
	project: ProjectItem;
	index: number;
	heroSrc: string;
	heroAlt: string;
	tagline: string;
	accent?: string;
	metric: CaseStudyMetric | null;
	roleTags: readonly string[];
};

export function ProjectShowcaseRow({
	project,
	index,
	heroSrc,
	heroAlt,
	tagline,
	accent,
	metric,
	roleTags,
}: ProjectShowcaseRowProps) {
	const flip = index % 2 === 1;
	const num = String(index + 1).padStart(2, "0");
	const isExternal = project.linkType === "external";
	const ctaLabel = project.ctaLabel ?? "Read case study";
	const rowStyle = accent
		? ({ "--row-accent": accent } as CSSProperties)
		: undefined;

	return (
		<RevealOnScroll>
			<div
				style={rowStyle}
				className="group/row relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
			>
				<TransitionLink
					href={project.href}
					className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
					{...(isExternal
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
				>
					<span className="sr-only">Read the {project.name} case study</span>
				</TransitionLink>

				<div
					className={`relative overflow-hidden rounded-3xl border border-white/11 bg-[#141414] ${
						flip ? "lg:order-2" : ""
					}`}
				>
					<div className="relative aspect-16/10 w-full overflow-hidden">
						<Image
							src={heroSrc}
							alt={heroAlt}
							fill
							unoptimized
							sizes="(max-width: 1024px) 100vw, 672px"
							loading={index === 0 ? "eager" : "lazy"}
							fetchPriority={index === 0 ? "high" : "auto"}
							className="object-cover brightness-105 contrast-105 transition duration-500 ease-out group-hover/row:scale-[1.03]"
						/>
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
						/>
					</div>
				</div>

				<div className={`flex flex-col gap-5 ${flip ? "lg:order-1" : ""}`}>
					<div className="flex items-center gap-2.5">
						<span className="font-mono text-[10px] tracking-wide text-neutral-600">
							{num}
						</span>
						<span aria-hidden className="h-px w-6 bg-white/20" />
						<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
							Case study
						</span>
					</div>

					<h2 className="font-serif text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight text-white">
						{project.name}
					</h2>

					<p className="max-w-[520px] text-base leading-relaxed text-neutral-400">
						{tagline}
					</p>

					{metric ? (
						<div className="flex flex-col gap-1.5">
							<span className="font-serif text-[clamp(36px,4vw,56px)] leading-none text-(--row-accent,var(--accent))">
								{metric.value}
							</span>
							<span className="max-w-[320px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-neutral-500">
								{metric.label}
							</span>
						</div>
					) : null}

					<div className="flex flex-wrap gap-1.5">
						{roleTags.map((tag) => (
							<Tag key={tag}>{tag}</Tag>
						))}
					</div>

					<span className="inline-flex w-fit items-center gap-1.5 text-sm text-neutral-300 underline-offset-4 transition group-hover/row:text-white group-hover/row:underline">
						{ctaLabel}
						<ArrowUpRight className="size-3.5 shrink-0" />
					</span>
				</div>
			</div>
		</RevealOnScroll>
	);
}
