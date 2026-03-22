"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { BentoCard } from "@/components/bento/bento-card";
import {
	BENTO_GRID_CELL_CLASS,
	BENTO_LABEL_CLASS,
	BENTO_SECTION_CLASS,
} from "@/components/bento/cards/styles";
import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { homeContent } from "@/content/home";

const iconMap = {
	linkedin: LinkedInIcon,
	github: GitHubIcon,
	mail: Mail,
} as const;

type ConnectCardProps = {
	className?: string;
	delay?: number;
};

export function ConnectCard({ className, delay = 0.18 }: ConnectCardProps) {
	const { connect } = homeContent;
	return (
		<BentoCard className={className} delay={delay}>
			<section id="connect" className={BENTO_SECTION_CLASS}>
				<div className="flex items-center justify-between">
					<span className={BENTO_LABEL_CLASS}>{connect.label}</span>
					<span
						className="size-2 shrink-0 rounded-full bg-emerald-500"
						aria-hidden
					/>
				</div>
				<div className="grid grid-cols-2 gap-2.5">
					{connect.links.map((link) => {
						const Icon = iconMap[link.icon];
						const wide = "wide" in link && link.wide;
						const newTab = "newTab" in link && link.newTab;
						return (
							<Tooltip key={link.id} delayDuration={80}>
								<TooltipTrigger asChild>
									<Link
										href={link.href}
										className={
											wide
												? `col-span-2 ${BENTO_GRID_CELL_CLASS}`
												: BENTO_GRID_CELL_CLASS
										}
										aria-label={link.label}
										{...(newTab && {
											target: "_blank",
											rel: "noopener noreferrer",
										})}
									>
										<Icon
											className="size-9 text-neutral-400 opacity-50 transition-colors group-hover:text-white group-hover:opacity-100"
											strokeWidth={1.25}
										/>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									{link.label}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</section>
		</BentoCard>
	);
}
