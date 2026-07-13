"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
};

/** Lightweight IntersectionObserver reveal, decoupled from the case-study scroll engine. */
export function RevealOnScroll({
	children,
	className,
	delay = 0,
}: RevealOnScrollProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setRevealed(true);
						observer.disconnect();
						break;
					}
				}
			},
			{ rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			style={revealed ? { transitionDelay: `${delay}s` } : undefined}
			className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
				revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
			} ${className ?? ""}`}
		>
			{children}
		</div>
	);
}
