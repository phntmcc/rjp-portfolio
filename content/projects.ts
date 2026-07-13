import { hasCaseStudy } from "@/content/case-studies";

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
};

export type ProjectItem = ExternalProject | InternalProject;

const projectItems: readonly ProjectItem[] = [
	{
		id: "scopeguard",
		slug: "scopeguard",
		name: "ScopeGuard",
		summary:
			"A field-first app I built for contractors to capture scope changes on-site and turn voice notes into clear, client-ready docs before rework kicks in.",
		thumbSrc: "/images/projects/scopeguard/scopeguard-thumbnail.png",
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
		ctaLabel: "Read case study",
	},
	{
		id: "tigers-den",
		slug: "tigers-den",
		name: "Tiger's Den Gym",
		summary:
			"Tiger's Den's first website, designed to hit hard on discovery and signups with sharp SEO, clear UX, and a brand presence that brought in serious local interest.",
		thumbSrc: "/images/projects/tigers-den/tigers-den-thumbnail.png",
		thumbAlt: "Tiger's Den Gym website thumbnail",
		tags: ["HTML", "CSS", "JavaScript", "jQuery", "Webflow", "Logo Design"],
		linkType: "internal",
		href: "/projects/tigers-den",
		ctaLabel: "Read case study",
	},
];

export const projectsContent = {
	headline: "Things I've Built",
	subhead:
		"A closer look at the work. Every project here ships with a full case study, from the problem and the calls I made to what actually happened once it was live.",
	items: projectItems,
} as const;

/** The most recent project. Curated by array order: first item is latest. */
export function getLatestProject() {
	return projectsContent.items[0];
}

export function getInternalProjectBySlug(slug: string) {
	return projectsContent.items.find(
		(item): item is InternalProject =>
			item.linkType === "internal" && item.slug === slug,
	);
}

export function projectHasCaseStudy(slug: string) {
	return hasCaseStudy(slug);
}
