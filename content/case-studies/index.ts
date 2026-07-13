import { scopeguardCaseStudy } from "@/content/case-studies/scopeguard";
import { tigersDenCaseStudy } from "@/content/case-studies/tigers-den";
import type {
	CaseStudy,
	CaseStudyMetric,
	CaseStudyNeighbor,
	CaseStudyNeighbors,
} from "@/content/case-studies/types";

export const caseStudyRegistry = [
	scopeguardCaseStudy,
	tigersDenCaseStudy,
] as const satisfies readonly CaseStudy[];

const caseStudyBySlug = new Map<string, CaseStudy>(
	caseStudyRegistry.map((caseStudy) => [caseStudy.slug, caseStudy]),
);

function toNeighbor(caseStudy: CaseStudy): CaseStudyNeighbor {
	return {
		slug: caseStudy.slug,
		index: caseStudy.index,
		name: caseStudy.name,
		summary: caseStudy.summary,
		tagline: caseStudy.tagline,
		accent: caseStudy.accent ?? "#a3a3a3",
		imageSrc: caseStudy.hero.src,
		imageAlt: caseStudy.hero.alt,
	};
}

export function hasCaseStudy(slug: string) {
	return caseStudyBySlug.has(slug);
}

export function getCaseStudyBySlug(slug: string) {
	return caseStudyBySlug.get(slug) ?? null;
}

export function getAllCaseStudySlugs() {
	return caseStudyRegistry.map((caseStudy) => caseStudy.slug);
}

/** The Role meta tags for a case study, used as the canonical tag set in listings. */
export function getCaseStudyRoleTags(slug: string): readonly string[] {
	const caseStudy = getCaseStudyBySlug(slug);
	if (!caseStudy) {
		return [];
	}

	const role = caseStudy.meta.find(
		(row) => row.kind === "tags" && row.label === "Role",
	);
	return role?.kind === "tags" ? role.tags : [];
}

/** The single most representative metric for a case study, for use in listings. */
export function getCaseStudyHeadlineMetric(
	slug: string,
): CaseStudyMetric | null {
	const caseStudy = getCaseStudyBySlug(slug);
	if (!caseStudy) {
		return null;
	}

	const spotlight = caseStudy.sections.find(
		(section) => section.type === "spotlight",
	);
	if (spotlight?.type === "spotlight" && spotlight.metric) {
		return spotlight.metric;
	}

	const outcome = caseStudy.sections.find(
		(section) => section.type === "outcome",
	);
	if (outcome?.type === "outcome" && outcome.metrics?.length) {
		return outcome.metrics[0];
	}

	return null;
}

export function getCaseStudyNeighbors(slug: string): CaseStudyNeighbors | null {
	const currentIndex = caseStudyRegistry.findIndex(
		(caseStudy) => caseStudy.slug === slug,
	);

	if (currentIndex === -1) {
		return null;
	}

	const prev = caseStudyRegistry[currentIndex - 1] ?? null;
	const next = caseStudyRegistry[currentIndex + 1] ?? null;

	return {
		prev: prev ? toNeighbor(prev) : null,
		next: next ? toNeighbor(next) : null,
		position: currentIndex + 1,
		total: caseStudyRegistry.length,
	};
}

export type {
	CaseStudy,
	CaseStudyMetric,
	CaseStudyNeighbor,
	CaseStudyNeighbors,
} from "@/content/case-studies/types";
export { buildSectionManifest } from "@/content/case-studies/types";
