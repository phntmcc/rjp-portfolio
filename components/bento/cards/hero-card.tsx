"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BentoCard } from "@/components/bento/bento-card";
import { contactMailto, homeContent } from "@/content/home";

function formatEstTime() {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZoneName: "short",
	}).format(new Date());
}

export function HeroCard({ className }: { className?: string }) {
	const [timeLabel, setTimeLabel] = useState(formatEstTime);

	useEffect(() => {
		const id = setInterval(() => setTimeLabel(formatEstTime()), 30_000);
		return () => clearInterval(id);
	}, []);

	const { hero } = homeContent;

	return (
		<BentoCard className={className} delay={0}>
			<section className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden p-6 lg:min-h-[527px]">
				<div className="pointer-events-none absolute inset-0 z-0">
					<Image
						src="/images/portrait.jpg"
						alt=""
						fill
						className="object-cover"
						sizes="(max-width: 1024px) calc(100vw - 2rem), 884px"
						quality={95}
						priority
					/>
					<div
						aria-hidden
						className="absolute inset-0"
						style={{
							background:
								"linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.15) 33%, rgba(0, 0, 0, 1) 100%)",
						}}
					/>
				</div>
				<div className="relative z-10 flex items-center justify-between gap-4">
					<Link
						href={contactMailto}
						className="flex items-center gap-2 overflow-visible rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:bg-white/10"
					>
						<span className="relative inline-flex size-2 shrink-0 items-center justify-center">
							<span
								className="motion-safe:absolute motion-safe:inset-0 motion-safe:animate-ping motion-safe:rounded-full motion-safe:bg-emerald-400/45"
								aria-hidden
							/>
							<span
								className="relative z-10 size-2 rounded-full bg-emerald-500"
								aria-hidden
							/>
						</span>
						<span className="text-[10px] text-neutral-300">{hero.badge}</span>
					</Link>
					<time
						className="font-mono text-xs text-neutral-500"
						dateTime={new Date().toISOString()}
						suppressHydrationWarning
					>
						{timeLabel}
					</time>
				</div>
				<div className="relative z-10 flex flex-col gap-4">
					<h1 className="font-serif text-4xl leading-tight text-white md:text-[56px]">
						<span className="block">{hero.headlineLead}</span>
						<span className="text-neutral-500">{hero.headlineAccent}</span>
					</h1>
					<p className="max-w-[616px] text-base text-neutral-400">
						{hero.subhead}
					</p>
				</div>
			</section>
		</BentoCard>
	);
}
