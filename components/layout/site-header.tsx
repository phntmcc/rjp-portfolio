import { Layers } from "lucide-react";
import { CommandMenuTrigger } from "@/components/layout/command-menu";
import { MarkLogo } from "@/components/layout/mark-logo";
import { TransitionLink } from "@/components/navigation/transition-link";
import { site } from "@/content/home";
import { SITE_CONTAINER_MAX_WIDTH_CLASS } from "@/lib/layout-constants";

export function SiteHeader() {
	return (
		<header
			className={`animate-page-header flex w-full ${SITE_CONTAINER_MAX_WIDTH_CLASS} shrink-0 items-center justify-between gap-3`}
		>
			<TransitionLink
				href="/"
				className="flex items-center gap-1.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
				aria-label="Go to home page"
			>
				<MarkLogo className="size-6 shrink-0" />
				<span className="adaptive-contrast text-base font-medium">
					{site.name}
				</span>
			</TransitionLink>
			<div className="flex items-center gap-2">
				<TransitionLink
					href="/projects"
					className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/85"
				>
					<Layers className="size-3.5 shrink-0" strokeWidth={2} />
					<span>View Work</span>
				</TransitionLink>
				<CommandMenuTrigger className="hidden rounded-full border border-white/15 bg-black/35 px-4 py-2 backdrop-blur-md transition hover:bg-black/50 sm:block" />
			</div>
		</header>
	);
}
