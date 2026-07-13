import type { ReactNode } from "react";

type TagProps = {
	children: ReactNode;
	className?: string;
};

export function Tag({ children, className }: TagProps) {
	return (
		<span
			className={`rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-neutral-400 ${className ?? ""}`}
		>
			{children}
		</span>
	);
}
