import { Tag } from "@/components/ui/tag";
import type { CaseStudyMetaRow } from "@/content/case-studies/types";

type CaseStudyMetaStripProps = {
	meta: readonly CaseStudyMetaRow[];
};

export function CaseStudyMetaStrip({ meta }: CaseStudyMetaStripProps) {
	return (
		<div className="case-study-mount mt-8 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] border-t border-white/10 [animation-delay:0.32s]">
			{meta.map((row) => (
				<div key={row.label} className="flex flex-col gap-2 py-3.5 pr-5">
					<span className="font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
						{row.label}
					</span>
					{row.kind === "tags" ? (
						<div className="flex flex-wrap gap-1.5">
							{row.tags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
						</div>
					) : (
						<span className="text-sm leading-normal text-neutral-200">
							{row.value}
						</span>
					)}
				</div>
			))}
		</div>
	);
}
