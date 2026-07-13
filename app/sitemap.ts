import type { MetadataRoute } from "next";
import { getAllCaseStudySlugs } from "@/content/case-studies";

function getSiteUrl() {
	const fallback = "https://robbiejpatterson.com";
	const raw = process.env.NEXT_PUBLIC_SITE_URL ?? fallback;
	return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl();
	const lastModified = new Date();
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/`,
			lastModified,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/projects`,
			lastModified,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/photography`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/resume`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];

	const caseStudyRoutes: MetadataRoute.Sitemap = getAllCaseStudySlugs().map(
		(slug) => ({
			url: `${siteUrl}/projects/${slug}`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.8,
		}),
	);

	return [...staticRoutes, ...caseStudyRoutes];
}
