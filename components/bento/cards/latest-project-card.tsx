import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { BentoCard } from "@/components/bento/bento-card";
import { BENTO_LABEL_CLASS } from "@/components/bento/cards/styles";
import { LightningBolt } from "@/components/icons/lightning-bolt";
import { TransitionLink } from "@/components/navigation/transition-link";
import { Tag } from "@/components/ui/tag";
import {
	getCaseStudyBySlug,
	getCaseStudyRoleTags,
} from "@/content/case-studies";
import { getLatestProject } from "@/content/projects";

const LATEST_PROJECT_LABEL = "LATEST PROJECT";

type LatestProjectCardProps = {
	className?: string;
	delay?: number;
};

export function LatestProjectCard({
	className,
	delay = 0.24,
}: LatestProjectCardProps) {
	const project = getLatestProject();
	const caseStudy = getCaseStudyBySlug(project.slug);
	const tagline = caseStudy?.tagline ?? project.summary;
	const accent = caseStudy?.accent;
	const imageSrc = caseStudy?.hero.src ?? project.thumbSrc;
	const imageAlt = caseStudy?.hero.alt ?? project.thumbAlt;
	const roleTags = getCaseStudyRoleTags(project.slug);
	const tags = (roleTags.length > 0 ? roleTags : project.tags).slice(0, 4);
	const isExternal = project.linkType === "external";

	const surfaceStyle: CSSProperties | undefined = accent
		? {
				background: `radial-gradient(130% 130% at 88% 0%, ${accent}24 0%, ${accent}0d 32%, transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))`,
			}
		: undefined;

	return (
		<BentoCard className={className} delay={delay} surfaceStyle={surfaceStyle}>
			<section
				id="latest-project"
				className="relative flex h-full min-h-0 flex-col gap-5 p-6 sm:flex-row sm:items-stretch sm:gap-6"
			>
				<TransitionLink
					href={project.href}
					className="absolute inset-0 z-20 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
					{...(isExternal
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
				>
					<span className="sr-only">Read the {project.name} case study</span>
				</TransitionLink>

				<div className="flex flex-1 flex-col gap-4">
					<div className="flex items-center gap-1.5">
						<LightningBolt className="shrink-0" />
						<span className={BENTO_LABEL_CLASS}>{LATEST_PROJECT_LABEL}</span>
					</div>

					<div className="flex flex-1 flex-col justify-center gap-3">
						<h2 className="font-serif text-[clamp(24px,2.4vw,32px)] leading-tight tracking-tight text-white">
							{project.name}
						</h2>
						<p className="max-w-[340px] text-sm leading-relaxed text-neutral-400">
							{tagline}
						</p>
						<div className="flex flex-wrap gap-1.5">
							{tags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
						</div>
						<span className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-neutral-300 underline-offset-4 transition group-hover/bento:text-white group-hover/bento:underline">
							{project.ctaLabel ?? "Read case study"}
							<ArrowUpRight className="size-3.5 shrink-0" />
						</span>
					</div>
				</div>

				<div className="relative aspect-2/1 w-full shrink-0 self-stretch overflow-hidden rounded-2xl border border-white/11 bg-[#141414] sm:aspect-auto sm:w-[46%]">
					<Image
						src={imageSrc}
						alt={imageAlt}
						fill
						unoptimized
						sizes="(max-width: 640px) 100vw, 360px"
						className="object-cover brightness-105 contrast-105 transition duration-500 ease-out group-hover/bento:scale-[1.03]"
					/>
				</div>
			</section>
		</BentoCard>
	);
}
