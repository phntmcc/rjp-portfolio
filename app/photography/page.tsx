import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PhotographyBoard } from "@/components/photography/photography-board";
import { photographyContent } from "@/content/photography";
import { PAGE_BOTTOM_PADDING_CLASS } from "@/lib/layout-constants";
import {
	getPhotographyLocations,
	getPhotographyPhotosPage,
} from "@/lib/photography";

type PhotographyPageProps = {
	searchParams: Promise<{ location?: string }>;
};

export const metadata: Metadata = {
	title: "Photography",
	description: photographyContent.subhead,
	alternates: {
		canonical: "/photography",
	},
	openGraph: {
		title: "Photography | Robbie Patterson",
		description: photographyContent.subhead,
		url: "/photography",
		images: [
			{
				url: "/images/Opengraph.png",
				width: 1200,
				height: 630,
				alt: "Robbie Patterson social preview",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Photography | Robbie Patterson",
		description: photographyContent.subhead,
		images: ["/images/Opengraph.png"],
	},
};

export default async function PhotographyPage({
	searchParams,
}: PhotographyPageProps) {
	const { location } = await searchParams;
	const activeLocation = location?.trim() || undefined;
	const [initialPage, locations] = await Promise.all([
		getPhotographyPhotosPage({ locationSlug: activeLocation }),
		getPhotographyLocations(),
	]);

	return (
		<main className={PAGE_BOTTOM_PADDING_CLASS}>
			<PageHeader
				title={photographyContent.headline}
				description={photographyContent.subhead}
			/>
			<PhotographyBoard
				initialPhotos={initialPage.photos}
				initialHasMore={initialPage.hasMore}
				locations={locations}
				activeLocation={activeLocation}
			/>
		</main>
	);
}
