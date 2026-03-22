"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

type BentoCardProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
	style?: CSSProperties;
	surfaceStyle?: CSSProperties;
	interactive?: boolean;
};

export function BentoCard({
	children,
	className,
	delay = 0,
	style,
	surfaceStyle,
	interactive = true,
}: BentoCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const reduceMotionRef = useRef(false);

	useEffect(() => {
		reduceMotionRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
	}, []);

	const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = ref.current;
		if (!el || reduceMotionRef.current || !interactive) return;
		const rect = el.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		el.style.setProperty("--mx", `${x}%`);
		el.style.setProperty("--my", `${y}%`);
		const px = (e.clientX - rect.left) / rect.width - 0.5;
		const py = (e.clientY - rect.top) / rect.height - 0.5;
		el.style.setProperty("--rx", `${py * -3.5}deg`);
		el.style.setProperty("--ry", `${px * 3.5}deg`);
		el.style.setProperty("--lift", "1.003");
	};

	const handleLeave = () => {
		const el = ref.current;
		if (!el) return;
		el.style.setProperty("--mx", "50%");
		el.style.setProperty("--my", "50%");
		el.style.setProperty("--rx", "0deg");
		el.style.setProperty("--ry", "0deg");
		el.style.setProperty("--lift", "1");
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tilt hover
		<div
			ref={ref}
			onMouseMove={interactive ? handleMove : undefined}
			onMouseLeave={interactive ? handleLeave : undefined}
			className={`group/bento relative h-full min-h-0 overflow-hidden rounded-3xl border border-solid border-white/11 bg-background transition-colors duration-300 ease-out [--lift:1] [--mx:50%] [--my:50%] [--rx:0deg] [--ry:0deg] animate-bento-in ${interactive ? "group-hover/bento:border-white/20" : ""} ${className ?? ""}`}
			style={
				{
					...style,
					"--bento-delay": `${delay}s`,
				} as CSSProperties
			}
		>
			{surfaceStyle ? (
				<div
					className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
					style={surfaceStyle}
					aria-hidden
				/>
			) : null}
			{interactive ? (
				<div
					className="bento-border-glow pointer-events-none absolute inset-0 z-1 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out motion-reduce:opacity-0 group-hover/bento:opacity-66"
					aria-hidden
				/>
			) : null}
			<div
				className={`${interactive ? "bento-card-tilt" : ""} relative z-10 flex h-full min-h-0 w-full min-w-0 flex-col`}
			>
				{children}
			</div>
		</div>
	);
}
