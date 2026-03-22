import type { Metadata } from "next";
import { BentoGrid } from "@/components/bento/bento-grid";
import { site } from "@/content/home";
import { getRandomHomePhotographyPhoto } from "@/lib/photography";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: site.title,
	description: site.description,
	alternates: {
		canonical: "/",
	},
};

export default async function Home() {
	const homePhoto = await getRandomHomePhotographyPhoto();

	return (
		<main>
			<BentoGrid homePhoto={homePhoto} />
		</main>
	);
}
