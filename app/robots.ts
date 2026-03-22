import type { MetadataRoute } from "next";

function getSiteUrl() {
	const fallback = "https://robbiejpatterson.com";
	const raw = process.env.NEXT_PUBLIC_SITE_URL ?? fallback;
	return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export default function robots(): MetadataRoute.Robots {
	const siteUrl = getSiteUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin"],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
