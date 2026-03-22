type PhotoExifPanelProps = {
	iso?: string | null;
	aperture?: string | null;
	shutterSpeed?: string | null;
	className?: string;
};

function ExifColumn({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex min-w-0 flex-col gap-0.5">
			<span className="font-mono text-[10px] leading-none text-[#a3a3a3]">
				{label}
			</span>
			<span className="font-mono text-[10px] leading-none text-[#d4d4d4]">
				{value}
			</span>
		</div>
	);
}

export function PhotoExifPanel({
	iso,
	aperture,
	shutterSpeed,
	className,
}: PhotoExifPanelProps) {
	const metrics = [
		{ label: "ISO", value: iso },
		{ label: "AP", value: aperture },
		{ label: "SS", value: shutterSpeed },
	].filter((item): item is { label: string; value: string } =>
		Boolean(item.value),
	);

	if (metrics.length === 0) return null;

	return (
		<div
			className={`flex w-fit max-w-full items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.58)] p-2 ${className ?? ""}`}
		>
			{metrics.map((item, index) => (
				<div key={item.label} className="flex items-stretch gap-3">
					<ExifColumn label={item.label} value={item.value} />
					{index < metrics.length - 1 ? (
						<div
							aria-hidden
							className="w-px shrink-0 self-stretch bg-[rgba(255,255,255,0.05)]"
						/>
					) : null}
				</div>
			))}
		</div>
	);
}
