"use client";

export type CaseStudyNavDirection = "forward" | "backward";

export const CASE_STUDY_TRANSITION_STORAGE_KEY = "rjp:case-study-transition";

export type CaseStudyTransitionState = {
	direction: CaseStudyNavDirection;
	destinationName: string;
};

export function setCaseStudyTransitionState(state: CaseStudyTransitionState) {
	if (typeof window === "undefined") return;
	sessionStorage.setItem(
		CASE_STUDY_TRANSITION_STORAGE_KEY,
		JSON.stringify(state),
	);
}

export function consumeCaseStudyTransitionState(): CaseStudyTransitionState | null {
	if (typeof window === "undefined") return null;
	const raw = sessionStorage.getItem(CASE_STUDY_TRANSITION_STORAGE_KEY);
	if (!raw) return null;
	sessionStorage.removeItem(CASE_STUDY_TRANSITION_STORAGE_KEY);
	try {
		return JSON.parse(raw) as CaseStudyTransitionState;
	} catch {
		return null;
	}
}

export function isCaseStudyRoute(pathname: string) {
	return /^\/projects\/[^/]+$/.test(pathname);
}
