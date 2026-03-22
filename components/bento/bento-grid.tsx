import { ConnectCard } from "@/components/bento/cards/connect-card";
import { HeroCard } from "@/components/bento/cards/hero-card";
import { LatestProjectCard } from "@/components/bento/cards/latest-project-card";
import { LocationCard } from "@/components/bento/cards/location-card";
import { PhotoCard } from "@/components/bento/cards/photo-card";
import { ToolkitCard } from "@/components/bento/cards/toolkit-card";
import {
	PAGE_BOTTOM_PADDING_CLASS,
	SITE_CONTAINER_MAX_WIDTH_CLASS,
} from "@/lib/layout-constants";
import type { HomePhotographyPhoto } from "@/lib/photography";

type BentoGridProps = {
	homePhoto?: HomePhotographyPhoto | null;
};

export function BentoGrid({ homePhoto }: BentoGridProps) {
	return (
		<div
			className={`grid w-full ${SITE_CONTAINER_MAX_WIDTH_CLASS} grid-cols-1 gap-4 ${PAGE_BOTTOM_PADDING_CLASS} lg:grid-cols-4 lg:grid-rows-3 lg:gap-4`}
		>
			<HeroCard className="lg:col-span-2 lg:row-span-2" />
			<ToolkitCard className="lg:col-span-2 lg:col-start-3 lg:row-start-1" />
			<PhotoCard
				className="lg:col-start-3 lg:row-span-2 lg:row-start-2"
				photo={homePhoto ?? undefined}
			/>
			<ConnectCard className="lg:col-start-4 lg:row-start-2" />
			<LatestProjectCard className="lg:col-span-2 lg:row-start-3" />
			<LocationCard className="lg:col-start-4 lg:row-start-3" />
		</div>
	);
}
