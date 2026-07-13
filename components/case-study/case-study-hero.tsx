import { ArrowUpRight } from "lucide-react";
import { CaseStudyMetaStrip } from "@/components/case-study/case-study-meta-strip";
import { HeroImage } from "@/components/case-study/hero-image";
import type { CaseStudy } from "@/content/case-studies/types";

type CaseStudyHeroProps = {
	caseStudy: CaseStudy;
	caseIndex: string;
};

export function CaseStudyHero({ caseStudy, caseIndex }: CaseStudyHeroProps) {
	return (
		<section
			id="heroSection"
			data-screen-label="Case study hero"
			className="relative pb-12 pt-8"
		>
			<div
				id="heroSticky"
				className="sticky top-6 z-1 origin-top will-change-[transform,filter,opacity]"
			>
				<div className="case-study-mount flex items-center gap-2.5">
					<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
						Case study
					</span>
					<span aria-hidden className="h-px w-6 bg-white/20" />
					<span className="font-mono text-[9px] leading-normal tracking-wide text-neutral-400">
						{caseIndex}
					</span>
				</div>

				<h1 className="mt-6 max-w-[1000px] overflow-hidden pb-[0.08em] font-serif text-[clamp(44px,5.6vw,76px)] leading-[1.05] tracking-tight text-white">
					<span className="case-study-mount-line block [animation-delay:0.08s]">
						{caseStudy.name}.
					</span>
				</h1>

				<p className="case-study-mount mt-4 max-w-[580px] text-base leading-normal text-neutral-400 [animation-delay:0.2s]">
					{caseStudy.tagline}
				</p>

				{caseStudy.liveUrl ? (
					<a
						href={caseStudy.liveUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit the ${caseStudy.name} live site`}
						className="case-study-mount mt-5 inline-flex items-center gap-1.5 text-sm text-neutral-300 underline-offset-4 transition [animation-delay:0.26s] hover:text-white hover:underline focus-visible:text-white focus-visible:underline"
					>
						Visit live site
						<ArrowUpRight className="size-3.5 shrink-0" />
					</a>
				) : null}

				<CaseStudyMetaStrip meta={caseStudy.meta} />

				<HeroImage
					src={caseStudy.hero.src}
					alt={caseStudy.hero.alt}
					caption={caseStudy.hero.caption}
				/>
			</div>
		</section>
	);
}
