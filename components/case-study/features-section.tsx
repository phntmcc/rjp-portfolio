import { CaseStudyMediaFrame } from "@/components/case-study/case-study-media";
import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import { CaseStudySectionHeader } from "@/components/case-study/section-header";
import type { CaseStudyFeaturesSection } from "@/content/case-studies/types";

type FeaturesSectionProps = {
	section: CaseStudyFeaturesSection;
	index: string;
};

export function FeaturesSection({ section, index }: FeaturesSectionProps) {
	const display = section.display ?? "rows";

	return (
		<section
			id={`sec-${section.id}`}
			data-screen-label={section.label}
			className="pt-20"
		>
			<ScrollReveal revealKey="features">
				<CaseStudySectionHeader
					index={index}
					label={section.label}
					className="mb-6"
				/>
				{section.intro ? (
					<p className="mb-8 max-w-[600px] text-sm leading-relaxed text-neutral-400">
						{section.intro}
					</p>
				) : null}
			</ScrollReveal>

			{display === "trio" ? (
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{section.items.map((item, itemIndex) => (
						<ScrollReveal
							key={item.title}
							revealKey={`feature-${itemIndex}`}
							delay={itemIndex * 0.08}
							className="flex flex-col gap-4"
						>
							{item.media ? (
								<div className="w-full">
									<CaseStudyMediaFrame media={item.media} />
								</div>
							) : null}
							<div className="flex flex-col gap-2">
								<h3 className="font-serif text-lg leading-snug text-white">
									{item.title}
								</h3>
								<p className="text-sm leading-relaxed text-neutral-400">
									{item.body}
								</p>
							</div>
						</ScrollReveal>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-14">
					{section.items.map((item, itemIndex) => {
						const flip = itemIndex % 2 === 1;
						return (
							<ScrollReveal
								key={item.title}
								revealKey={`feature-${itemIndex}`}
								className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]"
							>
								<div
									className={`flex flex-col gap-2 ${flip ? "lg:order-2" : ""}`}
								>
									<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
										{String(itemIndex + 1).padStart(2, "0")}
									</span>
									<h3 className="font-serif text-[clamp(20px,2vw,26px)] leading-snug text-white">
										{item.title}
									</h3>
									<p className="max-w-[460px] text-sm leading-relaxed text-neutral-400">
										{item.body}
									</p>
								</div>
								{item.media ? (
									<div
										className={`w-full ${flip ? "lg:order-1" : ""} ${
											item.media.orientation === "portrait"
												? "mx-auto max-w-[400px]"
												: ""
										}`}
									>
										<CaseStudyMediaFrame media={item.media} />
									</div>
								) : null}
							</ScrollReveal>
						);
					})}
				</div>
			)}
		</section>
	);
}
