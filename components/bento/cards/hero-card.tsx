"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import { BentoCard } from "@/components/bento/bento-card";
import { TransitionLink } from "@/components/navigation/transition-link";
import { contactMailto, homeContent } from "@/content/home";

const heroDelay = (delay: string): CSSProperties =>
	({ "--hero-delay": delay }) as CSSProperties;

function formatEstTime() {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
		timeZoneName: "short",
	}).format(new Date());
}

export function HeroCard({ className }: { className?: string }) {
	const [timeLabel, setTimeLabel] = useState(formatEstTime);

	useEffect(() => {
		const id = setInterval(() => setTimeLabel(formatEstTime()), 1_000);
		return () => clearInterval(id);
	}, []);

	const { hero } = homeContent;

	return (
		<BentoCard className={className} delay={0}>
			<section className="relative flex h-full min-h-[460px] flex-col justify-between overflow-hidden px-6 py-7 sm:min-h-[500px] sm:p-8 lg:min-h-[527px] lg:p-6">
				<div className="pointer-events-none absolute inset-0 z-0">
					<Image
						src="/images/portrait.jpg"
						alt=""
						fill
						className="object-cover object-[72%_18%] lg:object-[78%_22%]"
						sizes="(max-width: 1024px) calc(100vw - 2rem), 884px"
						quality={95}
						priority
					/>
					{/* Mobile: flat dark overlay only — no bottom gradient */}
					<div aria-hidden className="absolute inset-0 bg-black/70 lg:hidden" />
					{/* Desktop: left + bottom text-safe scrim; photo open upper-right */}
					<div
						aria-hidden
						className="absolute inset-0 hidden lg:block"
						style={{
							background: [
								"linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.62) 40%, rgba(0,0,0,0.22) 64%, rgba(0,0,0,0.06) 100%)",
								"linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.16) 34%, rgba(0,0,0,0.42) 58%, rgba(0,0,0,0.94) 100%)",
							].join(", "),
						}}
					/>
				</div>

				<div
					className="animate-hero-copy relative z-10 flex items-center justify-between gap-4"
					style={heroDelay("0.08s")}
				>
					<Link
						href={contactMailto}
						className="flex items-center gap-2 overflow-visible rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:bg-white/10"
					>
						<span className="relative inline-flex size-2 shrink-0 items-center justify-center">
							<span
								className="motion-safe:absolute motion-safe:inset-0 motion-safe:animate-ping motion-safe:rounded-full motion-safe:bg-accent/45"
								aria-hidden
							/>
							<span
								className="relative z-10 size-2 rounded-full bg-accent"
								aria-hidden
							/>
						</span>
						<span className="text-[10px] text-neutral-300">{hero.badge}</span>
					</Link>
					<time
						className="font-mono text-xs text-neutral-300"
						dateTime={new Date().toISOString()}
						suppressHydrationWarning
					>
						{timeLabel}
					</time>
				</div>

				<div className="relative z-10 flex max-w-136 flex-col gap-3 pt-14 sm:gap-3.5 sm:pt-16 lg:max-w-xl lg:gap-3 lg:pt-0">
					<h1
						className="animate-hero-copy font-serif text-[clamp(1.625rem,3.8vw,2.35rem)] leading-[1.15] tracking-[-0.02em] text-balance text-white"
						style={heroDelay("0.18s")}
					>
						{hero.headlineLead}{" "}
						<span className="text-white">{hero.headlineEmphasis}</span>
					</h1>
					<p
						className="animate-hero-copy font-serif text-[clamp(1.1rem,2.4vw,1.4rem)] leading-snug tracking-[-0.01em] text-white/75"
						style={heroDelay("0.24s")}
					>
						{hero.headlineAccent}
					</p>
					<p
						className="animate-hero-copy max-w-md text-[15px] leading-relaxed text-neutral-400 sm:text-base"
						style={heroDelay("0.3s")}
					>
						{hero.subhead}
					</p>
					<div className="animate-hero-copy pt-0.5" style={heroDelay("0.36s")}>
						<TransitionLink
							href={hero.ctaHref}
							className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 transition hover:text-white hover:underline"
						>
							{hero.ctaLabel}
							<ArrowUpRight className="size-3.5 shrink-0" />
						</TransitionLink>
					</div>
				</div>
			</section>
		</BentoCard>
	);
}
