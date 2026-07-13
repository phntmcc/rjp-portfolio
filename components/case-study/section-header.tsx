type CaseStudySectionHeaderProps = {
	index: string;
	label: string;
	className?: string;
};

export function CaseStudySectionHeader({
	index,
	label,
	className,
}: CaseStudySectionHeaderProps) {
	return (
		<div className={`flex items-center gap-2.5 ${className ?? ""}`}>
			<span className="font-mono text-[10px] leading-normal tracking-wide text-neutral-600">
				{index}
			</span>
			<span className="font-mono text-[9px] uppercase leading-normal tracking-[0.12em] text-neutral-500">
				{label}
			</span>
			<span aria-hidden className="h-px flex-1 bg-white/5" />
		</div>
	);
}
