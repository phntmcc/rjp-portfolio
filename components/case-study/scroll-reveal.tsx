import type { ReactNode } from "react";

type ScrollRevealProps = {
	children: ReactNode;
	revealKey: string;
	delay?: number;
	className?: string;
};

export function ScrollReveal({
	children,
	revealKey,
	delay = 0,
	className,
}: ScrollRevealProps) {
	return (
		<div
			data-rv-key={revealKey}
			data-rv-pending=""
			data-rv-delay={delay > 0 ? String(delay) : undefined}
			className={className}
		>
			{children}
		</div>
	);
}
