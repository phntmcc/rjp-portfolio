import Link from "next/link";
import type { CSSProperties } from "react";
import { EducationCard } from "@/components/resume/education-card";
import { ExperienceCard } from "@/components/resume/experience-card";
import { ResumeHeaderCard } from "@/components/resume/resume-header-card";
import { SkillsCard } from "@/components/resume/skills-card";
import { resumeContent } from "@/content/resume";
import {
	PAGE_BOTTOM_PADDING_CLASS,
	SITE_CONTAINER_MAX_WIDTH_CLASS,
} from "@/lib/layout-constants";

export function ResumeGrid() {
	return (
		<div
			className={`grid w-full ${SITE_CONTAINER_MAX_WIDTH_CLASS} grid-cols-1 gap-4 ${PAGE_BOTTOM_PADDING_CLASS} lg:grid-cols-3 lg:gap-4`}
		>
			<ResumeHeaderCard className="lg:col-span-3" />
			<div
				className="animate-resume-in lg:col-span-3"
				style={{ "--resume-delay": "0.14s" } as CSSProperties}
			>
				<div className="flex flex-wrap gap-2">
					{resumeContent.header.actions.map((action) => (
						<Link
							key={action.id}
							href={action.href}
							className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3.5 text-xs text-neutral-300 transition hover:bg-white/10 hover:text-white"
							{...("download" in action &&
								action.download && {
									download: true,
								})}
							{...("newTab" in action &&
								action.newTab && {
									target: "_blank",
									rel: "noopener noreferrer",
								})}
						>
							{action.label}
						</Link>
					))}
				</div>
			</div>
			<div className="lg:col-span-2">
				<div
					className="animate-resume-in mb-3 flex items-center gap-2"
					style={{ "--resume-delay": "0.2s" } as CSSProperties}
				>
					<span className="size-1.5 rounded-full bg-neutral-500" aria-hidden />
					<p className="font-mono text-[10px] uppercase text-neutral-500">
						{resumeContent.experienceLabel}
					</p>
				</div>
				<div
					className="animate-resume-in relative space-y-4"
					style={{ "--resume-delay": "0.24s" } as CSSProperties}
				>
					<div
						className="pointer-events-none absolute bottom-6 left-2 top-2 w-px bg-linear-to-b from-white/28 via-white/10 to-transparent"
						aria-hidden
					/>
					{resumeContent.experience.map((item, index) => (
						<div key={item.id} className="relative pl-6">
							<span
								className="absolute left-0 top-9 size-4 rounded-full border border-white/25 bg-[#111]"
								aria-hidden
							>
								<span className="absolute inset-1 rounded-full bg-white/35" />
							</span>
							<ExperienceCard experience={item} delay={0.28 + index * 0.07} />
						</div>
					))}
				</div>
			</div>
			<div
				className="animate-resume-in space-y-8 lg:pt-9"
				style={{ "--resume-delay": "0.36s" } as CSSProperties}
			>
				<SkillsCard className="border-l border-white/10 pl-4" />
				<EducationCard className="border-l border-white/10 pl-4" />
			</div>
		</div>
	);
}
