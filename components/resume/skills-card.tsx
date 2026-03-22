import { resumeContent } from "@/content/resume";

type SkillsCardProps = {
	className?: string;
};

export function SkillsCard({ className }: SkillsCardProps) {
	const { skills } = resumeContent;

	return (
		<section className={`space-y-4 ${className ?? ""}`}>
			<p className="font-mono text-[10px] uppercase text-neutral-500">
				{skills.label}
			</p>
			<div className="space-y-4">
				{skills.groups.map((group) => (
					<div key={group.id} className="space-y-1.5">
						<h3 className="text-sm font-medium text-neutral-200">
							{group.title}
						</h3>
						<p className="text-sm leading-relaxed text-neutral-400">
							{group.items}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
