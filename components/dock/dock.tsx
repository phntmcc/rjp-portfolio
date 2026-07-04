"use client";

import { Camera, FileText, Home, Layers } from "lucide-react";
import { usePathname } from "next/navigation";
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

function isItemActive(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	if (!href.startsWith("/")) return false;
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function Dock() {
	const pathname = usePathname();

	return (
		<nav
			className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center overflow-visible px-4"
			aria-label="Quick links"
		>
			<TooltipProvider delayDuration={180}>
				<div className="pointer-events-auto flex items-center gap-2.5 overflow-visible rounded-2xl border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-xl backdrop-saturate-150">
					{homeContent.dock.map((item) => {
						const Icon = iconMap[item.icon];
						const active = isItemActive(pathname, item.href);

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
												className={`${dockButtonClass} adaptive-contrast ${
													active
														? "!border-white/25 !bg-white/15"
														: ""
												}`}
												aria-label={item.label}
												aria-current={active ? "page" : undefined}
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
									{active ? (
										<span
											className="pointer-events-none absolute -bottom-3 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white"
											aria-hidden
										/>
									) : null}
								</div>
							</Fragment>
						);
					})}
				</div>
			</TooltipProvider>
		</nav>
	);
}
