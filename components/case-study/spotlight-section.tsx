import { CaseStudyMediaFrame } from "@/components/case-study/case-study-media";
import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import type { CaseStudySpotlightSection } from "@/content/case-studies/types";

type SpotlightSectionProps = {
	section: CaseStudySpotlightSection;
	index: string;
};

export function SpotlightSection({ section, index }: SpotlightSectionProps) {
	const isPortrait = section.media?.orientation === "portrait";
	const steps = section.steps ?? [];

	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-20"
		>
			<ScrollReveal revealKey="spotlight">
				<CaseStudySectionHeader
					index={index}
					label={section.label}
					className="mb-6"
				/>

				<div
					className={`grid grid-cols-1 gap-10 ${
						section.media ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]" : ""
					} lg:items-center`}
				>
					<div className="flex flex-col gap-6">
						<h3 className="max-w-[560px] font-serif text-[clamp(26px,2.8vw,40px)] leading-[1.1] text-white">
							{section.heading}
						</h3>

						{section.metric ? (
							<ScrollReveal
								revealKey="outcome"
								className="flex flex-col gap-2.5"
							>
								<span className="metric-value -mt-[0.12em] font-serif text-[clamp(48px,6vw,84px)] leading-none text-accent">
									{section.metric.value}
								</span>
								<span className="max-w-[300px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-neutral-500">
									{section.metric.label}
								</span>
							</ScrollReveal>
						) : null}

						<p className="max-w-[520px] text-sm leading-relaxed text-neutral-400">
							{section.body}
						</p>

						{steps.length > 0 ? (
							<ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
								{steps.map((step, stepIndex) => (
									<li key={step} className="flex items-center gap-2">
										<span className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-neutral-300">
											{step}
										</span>
										{stepIndex < steps.length - 1 ? (
											<span
												aria-hidden
												className="font-mono text-[11px] text-neutral-600"
											>
												→
											</span>
										) : null}
									</li>
								))}
							</ol>
						) : null}
					</div>

					{section.media ? (
						<div
							className={isPortrait ? "mx-auto w-full max-w-[440px]" : "w-full"}
						>
							<CaseStudyMediaFrame media={section.media} />
						</div>
					) : null}
				</div>
			</ScrollReveal>
		</section>
	);
}
