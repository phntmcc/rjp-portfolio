"use client";

type RouterLike = {
	push: (href: string) => void;
};

export const PAGE_NAVIGATE_EVENT = "rjp:navigate";
export const ROUTE_SETTLED_EVENT = "rjp:route-settled";

export type CaseStudyNavDirection = "forward" | "backward";

export type PageNavigateDetail = {
	href: string;
	navigate: () => void;
	direction?: CaseStudyNavDirection;
	destinationName?: string;
};

export function navigateWithTransition(
	router: RouterLike,
	href: string,
	options?: {
		direction?: CaseStudyNavDirection;
		destinationName?: string;
	},
) {
	if (typeof window === "undefined") {
		router.push(href);
		return;
	}

	const detail: PageNavigateDetail = {
		href,
		navigate: () => router.push(href),
		direction: options?.direction,
		destinationName: options?.destinationName,
	};

	const navigationEvent = new CustomEvent<PageNavigateDetail>(
		PAGE_NAVIGATE_EVENT,
		{
			detail,
			cancelable: true,
		},
	);

	const shouldContinue = window.dispatchEvent(navigationEvent);
	if (shouldContinue) {
		detail.navigate();
	}
}

export function isPlainLeftClick(
	event: Pick<
		MouseEvent,
		"button" | "metaKey" | "altKey" | "ctrlKey" | "shiftKey"
	>,
) {
	return (
		event.button === 0 &&
		!event.metaKey &&
		!event.altKey &&
		!event.ctrlKey &&
		!event.shiftKey
	);
}
