import { BentoGrid } from "@/components/bento/bento-grid";
import { getRandomHomePhotographyPhoto } from "@/lib/photography";

export const dynamic = "force-dynamic";

export default async function Home() {
	const homePhoto = await getRandomHomePhotographyPhoto();

	return (
		<main>
			<BentoGrid homePhoto={homePhoto} />
		</main>
	);
}
