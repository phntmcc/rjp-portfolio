export type ProjectGalleryImage = {
	id: string;
	src: string;
	alt: string;
	width: number;
	height: number;
};

type ProjectBase = {
	id: string;
	slug: string;
	name: string;
	summary: string;
	thumbSrc: string;
	thumbAlt: string;
	tags: readonly string[];
};

export type ExternalProject = ProjectBase & {
	linkType: "external";
	href: string;
	ctaLabel?: string;
};

export type InternalProject = ProjectBase & {
	linkType: "internal";
	href: `/projects/${string}`;
	ctaLabel?: string;
	intro: string;
	gallery: readonly ProjectGalleryImage[];
};

export type ProjectItem = ExternalProject | InternalProject;

const projectItems: readonly ProjectItem[] = [
	{
		id: "scopeguard",
		slug: "scopeguard",
		name: "ScopeGuard",
		summary:
			"A field-first app I built for contractors to capture scope changes on-site and turn voice notes into clear, client-ready docs before rework kicks in.",
		thumbSrc: "/images/projects/thumbnails/scopeguard.png",
		thumbAlt: "ScopeGuard app thumbnail",
		tags: [
			"React",
			"Next.js",
			"TypeScript",
			"Supabase",
			"UX/UI Design",
			"Brand Design",
		],
		linkType: "internal",
		href: "/projects/scopeguard",
		ctaLabel: "View images",
		intro:
			"ScopeGuard keeps fast-moving jobs aligned by turning on-site updates into structured scope documents while the work is still happening.",
		gallery: [
			{
				id: "scopeguard-demo-1",
				src: "/images/projects/scopeguard/scopeguard-demo1.png",
				alt: "ScopeGuard demo screen showing voice-first scope capture",
				width: 1024,
				height: 506,
			},
			{
				id: "scopeguard-demo-2",
				src: "/images/projects/scopeguard/scopeguard-demo2.png",
				alt: "ScopeGuard demo screen showing scope review workflow",
				width: 1024,
				height: 506,
			},
			{
				id: "scopeguard-demo-3",
				src: "/images/projects/scopeguard/scopeguard-demo3.png",
				alt: "ScopeGuard demo screen showing generated scope output",
				width: 1024,
				height: 506,
			},
		],
	},
	{
		id: "violynde",
		slug: "violynde",
		name: "Violynde",
		summary:
			"Built for John after a life-changing stroke, this Durham property-care brand pairs practical services with a mission that gives back to the Heart and Stroke Foundation.",
		thumbSrc: "/images/projects/thumbnails/violynde.png",
		thumbAlt: "Violynde website thumbnail",
		tags: [
			"HTML",
			"CSS",
			"JavaScript",
			"jQuery",
			"GSAP",
			"Webflow",
			"Logo Design",
		],
		linkType: "external",
		href: "https://violynde.webflow.io/",
		ctaLabel: "View project",
	},
	{
		id: "tigers-den",
		slug: "tigers-den",
		name: "Tiger's Den Gym",
		summary:
			"Tiger's Den's first website, designed to hit hard on discovery and signups with sharp SEO, clear UX, and a brand presence that brought in serious local interest.",
		thumbSrc: "/images/projects/thumbnails/tigersden.png",
		thumbAlt: "Tiger's Den Gym website thumbnail",
		tags: ["HTML", "CSS", "JavaScript", "jQuery", "Webflow", "Logo Design"],
		linkType: "external",
		href: "https://tigersden.webflow.io/",
		ctaLabel: "View project",
	},
	{
		id: "rust-twitch-drops",
		slug: "rust-twitch-drops",
		name: "Rust Twitch Drops",
		summary:
			"A passion build for a game I genuinely love, where I reimagined the Rust Twitch Drops experience to make the event feel clearer, bolder, and more fun to follow.",
		thumbSrc: "/images/projects/thumbnails/rusttwitchdrops.png",
		thumbAlt: "Rust Twitch Drops website thumbnail",
		tags: ["HTML", "CSS", "JavaScript", "jQuery", "Webflow"],
		linkType: "external",
		href: "https://rusttwitchdrops.webflow.io/",
		ctaLabel: "View project",
	},
];

export const projectsContent = {
	headline: "Things I've Built",
	subhead:
		"Real client work and passion builds, from fast product experiments to full launches. Every project is hands-on, outcome-driven, and made to feel good to use.",
	items: projectItems,
} as const;

export function getInternalProjectBySlug(slug: string) {
	return projectsContent.items.find(
		(item): item is InternalProject =>
			item.linkType === "internal" && item.slug === slug,
	);
}
