"use client";

import { Camera, FileText, Home, Layers } from "lucide-react";
import { Fragment } from "react";
import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { TransitionLink } from "@/components/navigation/transition-link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { homeContent } from "@/content/home";

const iconMap = {
	home: Home,
	layers: Layers,
	camera: Camera,
	github: GitHubIcon,
	linkedin: LinkedInIcon,
	"file-text": FileText,
} as const;

const dockButtonClass =
	"dock-magnify absolute inset-0 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5";

export function Dock() {
	return (
		<nav
			className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center overflow-visible px-4"
			aria-label="Quick links"
		>
			<TooltipProvider delayDuration={180}>
				<div className="pointer-events-auto flex items-center gap-2.5 overflow-visible rounded-2xl border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-xl backdrop-saturate-150">
					{homeContent.dock.map((item) => {
						const Icon = iconMap[item.icon];

						return (
							<Fragment key={item.id}>
								{item.id === "github" ? (
									<span
										className="hidden h-[22px] w-px shrink-0 bg-white/10 sm:block"
										aria-hidden
									/>
								) : null}
								<div className="relative size-[46px] shrink-0 overflow-visible">
									<Tooltip delayDuration={0}>
										<TooltipTrigger asChild>
											<TransitionLink
												href={item.href}
												className={`${dockButtonClass} adaptive-contrast`}
												aria-label={item.label}
												{...("newTab" in item &&
													item.newTab && {
														target: "_blank",
														rel: "noopener noreferrer",
													})}
											>
												<Icon className="size-4 shrink-0" strokeWidth={1.5} />
											</TransitionLink>
										</TooltipTrigger>
										<TooltipContent
											side="top"
											sideOffset={12}
											className="z-9999"
										>
											{item.label}
										</TooltipContent>
									</Tooltip>
								</div>
							</Fragment>
						);
					})}
				</div>
			</TooltipProvider>
		</nav>
	);
}
