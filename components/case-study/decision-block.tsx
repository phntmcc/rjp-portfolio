import { CaseStudyLightboxImage } from "@/components/case-study/case-study-lightbox-image";
import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import type { CaseStudyDecision } from "@/content/case-studies/types";

type DecisionBlockProps = {
	decision: CaseStudyDecision;
};

function formatDecisionIndex(num: string) {
	return num.padStart(2, "0");
}

const DECISION_IMAGE_FALLBACK = {
	landscape: { width: 2048, height: 1463 },
	portrait: { width: 1463, height: 2048 },
} as const;

export function DecisionBlock({ decision }: DecisionBlockProps) {
	const index = formatDecisionIndex(decision.num);
	const image = decision.image;
	const imageOrientation = image?.orientation ?? "landscape";
	const imageFallback = DECISION_IMAGE_FALLBACK[imageOrientation];

	return (
		<ScrollReveal revealKey={`decision-${decision.n}`}>
			<div className="relative overflow-visible pt-14">
				<span
					aria-hidden
					className="dec-watermark pointer-events-none absolute right-0 top-8 select-none overflow-visible font-serif text-[112px] leading-[0.88] text-white/4"
				>
					{index}
				</span>
				<div className="relative flex flex-col gap-4">
					<div className="flex items-start gap-3">
						<span className="mt-1.5 shrink-0 font-mono text-[10px] leading-normal tracking-wide text-neutral-600">
							{index}
						</span>
						<h3 className="max-w-[680px] font-serif text-[clamp(22px,2.1vw,26px)] leading-snug text-white">
							{decision.title}
						</h3>
					</div>
					<div className="grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8 pl-0 md:pl-8">
						<div className="flex flex-col gap-2">
							<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
								The call
							</span>
							<p className="text-sm leading-relaxed text-neutral-200">
								{decision.call}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
								Why
							</span>
							<p className="text-sm leading-relaxed text-neutral-400">
								{decision.why}
							</p>
						</div>
					</div>
					{decision.tradeoff ? (
						<div className="flex max-w-[820px] items-baseline gap-2.5 border-l border-white/10 py-0.5 pl-3.5 md:ml-8">
							<span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-600">
								Tradeoff
							</span>
							<p className="text-sm leading-normal text-neutral-500">
								{decision.tradeoff}
							</p>
						</div>
					) : null}
					{image ? (
						<div
							className={`mt-3 ${
								imageOrientation === "portrait"
									? "mx-auto w-full max-w-[320px]"
									: ""
							}`}
						>
							<CaseStudyLightboxImage
								src={image.src}
								alt={image.alt}
								width={image.width ?? imageFallback.width}
								height={image.height ?? imageFallback.height}
							/>
						</div>
					) : null}
				</div>
			</div>
		</ScrollReveal>
	);
}
