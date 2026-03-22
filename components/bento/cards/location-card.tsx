import { BentoCard } from "@/components/bento/bento-card";
import { LocationMap } from "@/components/bento/cards/location-map";
import { homeContent } from "@/content/home";

type LocationCardProps = {
	className?: string;
	delay?: number;
};

export function LocationCard({ className, delay = 0.3 }: LocationCardProps) {
	const { location } = homeContent;
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	return (
		<BentoCard className={className} delay={delay}>
			<section className="relative flex h-full min-h-[200px] items-end p-6 lg:min-h-[255px]">
				<div className="absolute inset-0">
					{apiKey ? (
						<LocationMap
							apiKey={apiKey}
							lat={location.lat}
							lng={location.lng}
							zoom={location.mapZoom}
						/>
					) : (
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_45%,#262626_0%,#0a0a0a_55%)]"
						/>
					)}
					<div
						className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent"
						aria-hidden
					/>
				</div>
				<div className="relative z-10 flex flex-col gap-1">
					<p className="text-xs text-neutral-400">{location.label}</p>
					<p className="font-serif text-2xl text-white">{location.place}</p>
				</div>
			</section>
		</BentoCard>
	);
}
