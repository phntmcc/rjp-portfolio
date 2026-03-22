"use client";

import Image from "next/image";
import { BENTO_GRID_CELL_CLASS } from "@/components/bento/cards/styles";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatExperienceDuration } from "@/lib/experience";

type ToolkitItem = {
	id: string;
	label: string;
	src: string;
	experienceStartYear: number;
};

export function ToolkitItem({ item }: { item: ToolkitItem }) {
	const duration = formatExperienceDuration(item.experienceStartYear);
	const line = `${item.label} · ${duration}`;

	return (
		<Tooltip delayDuration={80} disableHoverableContent>
			<TooltipTrigger
				className={`${BENTO_GRID_CELL_CLASS} group/toolkit w-full cursor-default transition-colors duration-200 ease-out hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/20`}
				aria-label={line}
			>
				<span className="relative inline-block h-9 w-10 shrink-0">
					<Image
						src={item.src}
						alt=""
						fill
						sizes="40px"
						className="object-contain opacity-50 grayscale transition-[filter,opacity] duration-200 ease-out group-hover/toolkit:opacity-100 group-hover/toolkit:grayscale-0"
					/>
				</span>
			</TooltipTrigger>
			<TooltipContent side="top" sideOffset={8}>
				<span className="whitespace-nowrap">{line}</span>
			</TooltipContent>
		</Tooltip>
	);
}
