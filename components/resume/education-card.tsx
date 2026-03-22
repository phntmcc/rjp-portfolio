import { resumeContent } from "@/content/resume";

type EducationCardProps = {
	className?: string;
};

export function EducationCard({ className }: EducationCardProps) {
	const { education } = resumeContent;

	return (
		<section className={`space-y-2 ${className ?? ""}`}>
			<p className="font-mono text-[10px] uppercase text-neutral-500">
				{education.label}
			</p>
			<h3 className="font-serif text-2xl text-white">{education.degree}</h3>
			<p className="text-sm text-neutral-300">{education.institution}</p>
			<p className="text-sm leading-relaxed text-neutral-500">
				{education.details}
			</p>
		</section>
	);
}
