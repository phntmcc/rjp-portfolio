"use client";

type RouterLike = {
	push: (href: string) => void;
};

export const PAGE_NAVIGATE_EVENT = "rjp:navigate";

export type PageNavigateDetail = {
	href: string;
	navigate: () => void;
};

export function navigateWithTransition(router: RouterLike, href: string) {
	if (typeof window === "undefined") {
		router.push(href);
		return;
	}

	const detail: PageNavigateDetail = {
		href,
		navigate: () => router.push(href),
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
