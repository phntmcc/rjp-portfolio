import type { ProjectGalleryImage } from "@/content/projects";

export type CaseStudyMetaTags = {
	label: string;
	kind: "tags";
	tags: readonly string[];
};

export type CaseStudyMetaText = {
	label: string;
	kind: "text";
	value: string;
};

export type CaseStudyMetaRow = CaseStudyMetaTags | CaseStudyMetaText;

export type CaseStudyConstraint = {
	label: string;
	value: string;
	consequence: string;
};

export type CaseStudyDecision = {
	n: number;
	num: string;
	title: string;
	call: string;
	why: string;
	tradeoff?: string;
	image?: {
		src: string;
		alt: string;
		orientation?: "portrait" | "landscape";
		width?: number;
		height?: number;
	};
};

export type CaseStudyMetric = {
	value: string;
	label: string;
};

export type CaseStudyQuote = {
	text: string;
	attribution: string;
};

export type CaseStudyMedia = {
	src: string;
	alt: string;
	orientation?: "portrait" | "landscape";
	width?: number;
	height?: number;
};

export type CaseStudyFeatureItem = {
	title: string;
	body: string;
	media?: CaseStudyMedia;
};

type CaseStudySectionBase = {
	/** Anchor id (rendered as sec-<id>) and scroll-spy target. */
	id: string;
	/** Rail label. */
	label: string;
};

export type CaseStudyBriefSection = CaseStudySectionBase & {
	type: "brief";
	pull: string;
	situation: string;
	ask: string;
};

export type CaseStudyConstraintsSection = CaseStudySectionBase & {
	type: "constraints";
	intro?: string;
	items: readonly CaseStudyConstraint[];
};

export type CaseStudyDecisionsSection = CaseStudySectionBase & {
	type: "decisions";
	items: readonly CaseStudyDecision[];
};

export type CaseStudySpotlightSection = CaseStudySectionBase & {
	type: "spotlight";
	heading: string;
	body: string;
	metric?: CaseStudyMetric;
	steps?: readonly string[];
	media?: CaseStudyMedia;
};

export type CaseStudyFeaturesSection = CaseStudySectionBase & {
	type: "features";
	intro?: string;
	display?: "rows" | "trio";
	items: readonly CaseStudyFeatureItem[];
};

export type CaseStudyMediaSection = CaseStudySectionBase & {
	type: "media";
	caption?: string;
	items: readonly ProjectGalleryImage[];
};

export type CaseStudyOutcomeSection = CaseStudySectionBase & {
	type: "outcome";
	metrics?: readonly CaseStudyMetric[];
	quote?: CaseStudyQuote;
	shipped: string;
};

export type CaseStudySection =
	| CaseStudyBriefSection
	| CaseStudyConstraintsSection
	| CaseStudyDecisionsSection
	| CaseStudySpotlightSection
	| CaseStudyFeaturesSection
	| CaseStudyMediaSection
	| CaseStudyOutcomeSection;

export type CaseStudy = {
	slug: string;
	index: string;
	name: string;
	tagline: string;
	summary: string;
	/** Optional per-case-study brand accent (any CSS color). Overrides the site accent on this page. */
	accent?: string;
	/** Optional public URL for the shipped site. Renders a "Visit live site" link in the hero when set. */
	liveUrl?: string;
	hero: {
		src: string;
		alt: string;
		caption: string;
	};
	meta: readonly CaseStudyMetaRow[];
	sections: readonly CaseStudySection[];
};

export type CaseStudySectionManifestItem = {
	id: string;
	label: string;
	index: string;
};

export type CaseStudyNeighbor = {
	slug: string;
	index: string;
	name: string;
	summary: string;
	tagline: string;
	accent: string;
	imageSrc: string;
	imageAlt: string;
};

export type CaseStudyNeighbors = {
	prev: CaseStudyNeighbor | null;
	next: CaseStudyNeighbor | null;
	position: number;
	total: number;
};

/** Order-based section manifest: numbering follows the sections array. */
export function buildSectionManifest(
	caseStudy: CaseStudy,
): CaseStudySectionManifestItem[] {
	return caseStudy.sections.map((section, position) => ({
		id: section.id,
		label: section.label,
		index: String(position + 1).padStart(2, "0"),
	}));
}
