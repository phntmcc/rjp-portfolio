import Image from "next/image";
import { BentoCard } from "@/components/bento/bento-card";
import { resumeContent } from "@/content/resume";

type ResumeHeaderCardProps = {
	className?: string;
	delay?: number;
};

export function ResumeHeaderCard({
	className,
	delay = 0,
}: ResumeHeaderCardProps) {
	const { header } = resumeContent;
	const hasPhoto = header.photoSrc.length > 0;

	return (
		<BentoCard className={className} delay={delay} interactive={false}>
			<section className="flex h-full min-h-0 flex-col gap-5 bg-white/3 p-6">
				<div className="grid gap-5 sm:grid-cols-[1fr_auto]">
					<div className="space-y-5">
						<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
							<p className="font-mono text-[10px] uppercase text-neutral-500">
								{header.label}
							</p>
							<span
								className="size-1.5 rounded-full bg-emerald-500"
								aria-hidden
							/>
							<p className="text-xs text-neutral-400">{header.workStatus}</p>
						</div>
						<div className="space-y-2">
							<h1 className="font-serif text-3xl text-white sm:text-4xl">
								{header.name}
							</h1>
							<p className="text-base text-neutral-300">{header.title}</p>
							<p className="text-sm text-neutral-500">{header.location}</p>
						</div>
						<p className="max-w-3xl text-base text-neutral-400">
							{header.summary}
						</p>
					</div>
					<div className="mx-0 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(38,38,38,0.65)]">
						{hasPhoto ? (
							<Image
								src={header.photoSrc}
								alt={header.photoAlt}
								width={512}
								height={512}
								quality={100}
								className="h-full w-full scale-400 object-cover object-[82%_15px]"
							/>
						) : (
							<div className="flex h-full w-full flex-col items-center justify-center gap-1 text-neutral-500">
								<span className="font-serif text-2xl text-neutral-300">RP</span>
								<span className="font-mono text-[10px] uppercase">
									Add photo
								</span>
							</div>
						)}
					</div>
				</div>
			</section>
		</BentoCard>
	);
}
