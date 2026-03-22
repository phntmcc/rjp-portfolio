import type { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	description?: string;
	eyebrow?: string;
	actions?: ReactNode;
	className?: string;
};

export function PageHeader({
	title,
	description,
	eyebrow,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<section
			className={`animate-resume-in mb-6 max-w-3xl space-y-3 ${className ?? ""}`}
		>
			{eyebrow ? (
				<p className="font-mono text-[10px] uppercase text-neutral-500">
					{eyebrow}
				</p>
			) : null}
			<h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
				{title}
			</h1>
			{description ? (
				<p className="text-base text-neutral-400">{description}</p>
			) : null}
			{actions}
		</section>
	);
}
