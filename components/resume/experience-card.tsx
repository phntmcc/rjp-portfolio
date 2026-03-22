import { BentoCard } from "@/components/bento/bento-card";
import type { ResumeExperience } from "@/content/resume";

type ExperienceCardProps = {
	experience: ResumeExperience;
	delay?: number;
};

export function ExperienceCard({ experience, delay = 0 }: ExperienceCardProps) {
	const dateRange = `${experience.start} - ${experience.end}`;

	return (
		<BentoCard delay={delay} interactive={false}>
			<article className="flex h-full min-h-0 flex-col gap-4 bg-white/3 p-6">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-1">
						<p className="font-mono text-[10px] uppercase text-neutral-500">
							{experience.company}
						</p>
						<h2 className="font-serif text-2xl text-white">
							{experience.role}
						</h2>
						<p className="text-sm text-neutral-500">{experience.location}</p>
					</div>
					<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase text-neutral-400">
						{dateRange}
					</span>
				</div>
				<ul className="space-y-2.5">
					{experience.highlights.map((highlight) => (
						<li
							key={highlight}
							className="flex items-start gap-2 text-sm text-neutral-400"
						>
							<span
								className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600"
								aria-hidden
							/>
							<span>{highlight}</span>
						</li>
					))}
				</ul>
			</article>
		</BentoCard>
	);
}
