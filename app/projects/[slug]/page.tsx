import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import {
	getAllCaseStudySlugs,
	getCaseStudyBySlug,
	getCaseStudyNeighbors,
} from "@/content/case-studies";

type ProjectDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: ProjectDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const caseStudy = getCaseStudyBySlug(slug);

	if (!caseStudy) {
		return {
			title: "Project not found",
			description: "The requested project could not be found.",
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const canonical = `/projects/${caseStudy.slug}`;

	return {
		title: caseStudy.name,
		description: caseStudy.tagline,
		alternates: {
			canonical,
		},
		openGraph: {
			title: `${caseStudy.name} | Robbie Patterson`,
			description: caseStudy.tagline,
			url: canonical,
			type: "article",
			images: [
				{
					url: caseStudy.hero.src,
					alt: caseStudy.hero.alt,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${caseStudy.name} | Robbie Patterson`,
			description: caseStudy.tagline,
			images: [caseStudy.hero.src],
		},
	};
}

export default async function ProjectDetailPage({
	params,
}: ProjectDetailPageProps) {
	const { slug } = await params;
	const caseStudy = getCaseStudyBySlug(slug);
	const neighbors = getCaseStudyNeighbors(slug);

	if (!caseStudy || !neighbors) {
		notFound();
	}

	return <CaseStudyPage caseStudy={caseStudy} neighbors={neighbors} />;
}
