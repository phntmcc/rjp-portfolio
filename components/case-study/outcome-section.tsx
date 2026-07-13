import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import type { CaseStudyOutcomeSection } from "@/content/case-studies/types";

type OutcomeSectionProps = {
	section: CaseStudyOutcomeSection;
	index: string;
};

export function OutcomeSection({ section, index }: OutcomeSectionProps) {
	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-20"
		>
			<ScrollReveal revealKey="outcome">
				<CaseStudySectionHeader
					index={index}
					label={section.label}
					className="mb-6"
				/>

				{section.metrics && section.metrics.length > 0 ? (
					<div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] border-y border-white/10">
						{section.metrics.map((metric) => (
							<div key={metric.label} className="flex flex-col gap-2 py-8 pr-6">
								<span className="metric-value font-serif text-[clamp(36px,3.5vw,52px)] leading-none text-white">
									{metric.value}
								</span>
								<span className="max-w-[220px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-neutral-500">
									{metric.label}
								</span>
							</div>
						))}
					</div>
				) : null}

				{section.quote ? (
					<figure className="mt-10 max-w-[760px] border-l border-white/10 pl-5">
						<blockquote className="font-serif text-[clamp(22px,2.1vw,28px)] italic leading-snug text-neutral-200">
							&ldquo;{section.quote.text}&rdquo;
						</blockquote>
						<figcaption className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
							{section.quote.attribution}
						</figcaption>
					</figure>
				) : null}

				<div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/45 px-3 py-1.5 backdrop-blur-md">
					<span
						aria-hidden
						className="size-1.5 shrink-0 rounded-full bg-accent"
					/>
					<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-300">
						{section.shipped}
					</span>
				</div>
			</ScrollReveal>
		</section>
	);
}
