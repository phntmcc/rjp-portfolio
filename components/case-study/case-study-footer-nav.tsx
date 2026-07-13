"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { BentoCard } from "@/components/bento/bento-card";
import { setCaseStudyTransitionState } from "@/components/navigation/case-study-transition";
import { TransitionLink } from "@/components/navigation/transition-link";
import {
	type CaseStudyNavDirection,
	navigateWithTransition,
} from "@/components/navigation/transition-routing";
import type {
	CaseStudyNeighbor,
	CaseStudyNeighbors,
} from "@/content/case-studies";

type CaseStudyFooterNavProps = {
	neighbors: CaseStudyNeighbors;
};

function accentSurface(accent: string, side: "left" | "right"): CSSProperties {
	const x = side === "left" ? "12%" : "88%";
	return {
		background: `radial-gradient(130% 130% at ${x} 0%, ${accent}24 0%, ${accent}0d 32%, transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))`,
	};
}

function NavCard({
	neighbor,
	direction,
}: {
	neighbor: CaseStudyNeighbor;
	direction: CaseStudyNavDirection;
}) {
	const isPrev = direction === "backward";

	const image = (
		<div className="relative aspect-3/2 w-[38%] shrink-0 self-stretch overflow-hidden rounded-xl border border-white/11 bg-[#141414]">
			<Image
				src={neighbor.imageSrc}
				alt={neighbor.imageAlt}
				fill
				unoptimized
				sizes="200px"
				className="object-cover brightness-105 contrast-105 transition duration-500 ease-out group-hover/bento:scale-[1.03]"
			/>
		</div>
	);

	return (
		<section
			className={`relative flex min-h-[150px] items-stretch gap-4 p-5 ${
				isPrev ? "" : "flex-row-reverse"
			}`}
		>
			{image}
			<div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
				<span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
					{isPrev ? <ArrowDownLeft className="size-3.5 shrink-0" /> : null}
					{isPrev ? "Previous" : "Next"} · {neighbor.index}
					{isPrev ? null : <ArrowUpRight className="size-3.5 shrink-0" />}
				</span>
				<div className="flex flex-col gap-1.5">
					<span className="font-serif text-[clamp(24px,2.4vw,30px)] leading-tight text-white">
						{neighbor.name}
					</span>
					<span className="line-clamp-2 text-sm leading-normal text-neutral-400">
						{neighbor.tagline}
					</span>
				</div>
			</div>
		</section>
	);
}

function NavCardEmpty({
	eyebrow,
	title,
	summary,
}: {
	eyebrow: string;
	title: string;
	summary: string;
}) {
	return (
		<div className="flex min-h-[150px] flex-col justify-between gap-5 p-5">
			<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-700">
				{eyebrow}
			</span>
			<div className="flex flex-col gap-1.5">
				<span className="font-serif text-[clamp(24px,2.4vw,30px)] leading-tight text-neutral-600">
					{title}
				</span>
				<span className="max-w-[400px] text-sm leading-normal text-neutral-700">
					{summary}
				</span>
			</div>
		</div>
	);
}

function CaseStudyNavButton({
	href,
	direction,
	destinationName,
	children,
}: {
	href: string;
	direction: CaseStudyNavDirection;
	destinationName: string;
	children: ReactNode;
}) {
	const router = useRouter();

	return (
		<button
			type="button"
			onClick={() => {
				setCaseStudyTransitionState({ direction, destinationName });
				navigateWithTransition(router, href, { direction, destinationName });
			}}
			className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
		>
			{children}
		</button>
	);
}

export function CaseStudyFooterNav({ neighbors }: CaseStudyFooterNavProps) {
	const { prev, next } = neighbors;

	return (
		<section data-screen-label="Footer navigation" className="pt-24">
			<div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
				{prev ? (
					<CaseStudyNavButton
						href={`/projects/${prev.slug}`}
						direction="backward"
						destinationName={prev.name}
					>
						<BentoCard
							interactive
							surfaceStyle={accentSurface(prev.accent, "left")}
						>
							<NavCard neighbor={prev} direction="backward" />
						</BentoCard>
					</CaseStudyNavButton>
				) : (
					<BentoCard interactive={false}>
						<NavCardEmpty
							eyebrow="Previous project"
							title="Start of the archive."
							summary="This is the first case study."
						/>
					</BentoCard>
				)}

				{next ? (
					<CaseStudyNavButton
						href={`/projects/${next.slug}`}
						direction="forward"
						destinationName={next.name}
					>
						<BentoCard
							interactive
							surfaceStyle={accentSurface(next.accent, "right")}
						>
							<NavCard neighbor={next} direction="forward" />
						</BentoCard>
					</CaseStudyNavButton>
				) : (
					<BentoCard interactive={false}>
						<NavCardEmpty
							eyebrow="Next project"
							title="More on the way."
							summary="This is the latest case study."
						/>
					</BentoCard>
				)}
			</div>

			<div className="mt-10 flex justify-center">
				<TransitionLink
					href="/projects"
					className="font-mono text-[11px] uppercase tracking-wide text-neutral-500 underline-offset-4 transition hover:text-neutral-200 hover:underline"
				>
					↖ Back to all work
				</TransitionLink>
			</div>
		</section>
	);
}
