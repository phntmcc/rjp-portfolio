"use client";

import type { CaseStudySectionManifestItem } from "@/content/case-studies/types";

type CaseStudyRailProps = {
	sections: CaseStudySectionManifestItem[];
	activeSectionId: string | null;
	activeCount: string;
	readingNow: string;
	onSectionClick: (sectionId: string) => void;
};

export function CaseStudyRail({
	sections,
	activeSectionId,
	activeCount,
	readingNow,
	onSectionClick,
}: CaseStudyRailProps) {
	return (
		<aside className="relative hidden lg:block">
			<div
				id="railSticky"
				className="case-study-mount sticky top-12 pt-16 [animation-delay:0.6s]"
			>
				<div className="mb-4 flex items-center justify-between gap-2.5">
					<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-600">
						Index
					</span>
					<span
						id="activeCountEl"
						className="font-mono text-[9px] leading-normal tracking-wide text-neutral-700"
					>
						{activeCount}
					</span>
				</div>

				<div id="railTrack" className="relative flex flex-col">
					<div
						id="railLine"
						aria-hidden
						className="absolute left-[3px] z-0 w-px bg-white/5"
					/>
					<div
						id="railFill"
						aria-hidden
						className="absolute left-[3px] z-0 h-0 w-px bg-neutral-400 transition-[height] duration-150 ease-linear"
					/>
					{sections.map((section, index) => {
						const isActive = section.id === activeSectionId;
						const isPassed =
							activeSectionId !== null &&
							sections.findIndex((item) => item.id === activeSectionId) > index;

						return (
							<button
								key={section.id}
								type="button"
								data-sec-id={section.id}
								onClick={() => onSectionClick(section.id)}
								className="relative z-1 flex cursor-pointer items-center gap-3 border-0 bg-transparent py-2.5 text-left transition-opacity hover:opacity-85"
							>
								<span
									aria-hidden
									className={`rail-dot relative z-1 size-[7px] shrink-0 rounded-full border transition-all duration-300 ease-out ${
										isActive
											? "border-white bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.12)]"
											: isPassed
												? "border-neutral-500 bg-neutral-500"
												: "border-neutral-700 bg-background"
									}`}
								/>
								<span
									className={`rail-label font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 ease-out ${
										isActive
											? "text-white"
											: isPassed
												? "text-neutral-400"
												: "text-neutral-500"
									}`}
								>
									{section.label}
								</span>
							</button>
						);
					})}
				</div>

				<div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
					<span aria-hidden className="relative size-[6px] shrink-0">
						<span className="absolute inset-0 rounded-full bg-accent" />
					</span>
					<div className="flex min-w-0 flex-col gap-0.5">
						<span className="font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-700">
							Reading now
						</span>
						<span
							id="readingNowEl"
							className="truncate font-mono text-[10px] uppercase tracking-widest text-neutral-200"
						>
							{readingNow}
						</span>
					</div>
				</div>
			</div>
		</aside>
	);
}

type CaseStudyMobileRailProps = {
	sections: CaseStudySectionManifestItem[];
	activeSectionId: string | null;
	onSectionClick: (sectionId: string) => void;
};

export function CaseStudyMobileRail({
	sections,
	activeSectionId,
	onSectionClick,
}: CaseStudyMobileRailProps) {
	return (
		<div className="sticky top-20 z-20 -mx-6 border-b border-white/5 bg-[#0a0a0a]/90 px-6 py-3 backdrop-blur-md sm:top-24 lg:hidden">
			<div className="flex gap-2 overflow-x-auto pb-1">
				{sections.map((section) => {
					const isActive = section.id === activeSectionId;
					return (
						<button
							key={section.id}
							type="button"
							onClick={() => onSectionClick(section.id)}
							className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors ${
								isActive
									? "border-white/20 bg-white/10 text-white"
									: "border-white/10 bg-white/3 text-neutral-500"
							}`}
						>
							{section.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
