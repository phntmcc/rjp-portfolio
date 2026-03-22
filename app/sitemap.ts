import type { MetadataRoute } from "next";
import { projectsContent } from "@/content/projects";

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

	const internalProjectRoutes: MetadataRoute.Sitemap = projectsContent.items
		.filter((item) => item.linkType === "internal")
		.map((item) => ({
			url: `${siteUrl}${item.href}`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.8,
		}));

	return [...staticRoutes, ...internalProjectRoutes];
}
