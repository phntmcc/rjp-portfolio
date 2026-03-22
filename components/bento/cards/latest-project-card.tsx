import Image from "next/image";
import Link from "next/link";
import { BentoCard } from "@/components/bento/bento-card";
import {
	BENTO_LABEL_CLASS,
	BENTO_SECTION_CLASS,
} from "@/components/bento/cards/styles";
import { LightningBolt } from "@/components/icons/lightning-bolt";
import { homeContent } from "@/content/home";

type LatestProjectCardProps = {
	className?: string;
	delay?: number;
};

export function LatestProjectCard({
	className,
	delay = 0.24,
}: LatestProjectCardProps) {
	const { latestProject } = homeContent;
	return (
		<BentoCard className={className} delay={delay}>
			<section id="latest-project" className={BENTO_SECTION_CLASS}>
				<div className="flex items-center gap-1.5">
					<LightningBolt className="shrink-0" />
					<span className={BENTO_LABEL_CLASS}>{latestProject.label}</span>
				</div>
				<div className="flex min-h-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex max-w-[300px] flex-col gap-1">
						<h2 className="font-serif text-2xl text-white">
							{latestProject.title}
						</h2>
						<p className="text-base text-neutral-400">
							{latestProject.description}
						</p>
						<Link
							href={latestProject.href}
							className="mt-2 w-fit text-sm text-neutral-500 underline-offset-4 hover:text-neutral-300 hover:underline"
						>
							View project
						</Link>
					</div>
					<div className="relative mx-auto h-[120px] w-[119px] shrink-0 sm:mx-0 sm:h-[136px] sm:w-[119px]">
						<Image
							src={latestProject.imageSrc}
							alt=""
							fill
							sizes="119px"
							className="object-contain"
							priority
						/>
					</div>
				</div>
			</section>
		</BentoCard>
	);
}
