"use client";

import { useCallback, useRef } from "react";

/** Seconds between each item of a batch that scrolls into view together. */
const STAGGER_SECONDS = 0.06;
/**
 * Masonry columns rarely align their tops exactly, so items within this many
 * pixels of each other are treated as one row and stagger left to right.
 */
const ROW_TOLERANCE_PX = 80;

/**
 * Reveals items as they scroll into view, staggered by their position *within
 * the batch that arrived together* rather than their index in the list.
 *
 * A single observer is shared across every item because the photo grid grows
 * without bound through infinite scroll. Batch-relative delays are the reason
 * the observer has to be shared: an index-derived delay would leave the
 * sixtieth photo waiting over a second after it had already entered the
 * viewport.
 */
export function useStaggeredReveal() {
	const observerRef = useRef<IntersectionObserver | null>(null);

	const getObserver = useCallback(() => {
		if (observerRef.current) return observerRef.current;
		if (typeof IntersectionObserver === "undefined") return null;

		observerRef.current = new IntersectionObserver(
			(entries, observer) => {
				const arrived = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => {
						const delta = a.boundingClientRect.top - b.boundingClientRect.top;
						if (Math.abs(delta) > ROW_TOLERANCE_PX) return delta;
						return a.boundingClientRect.left - b.boundingClientRect.left;
					});

				arrived.forEach((entry, index) => {
					const element = entry.target as HTMLElement;
					observer.unobserve(element);
					if (!element.hasAttribute("data-photo-pending")) return;

					element.style.setProperty(
						"--bento-delay",
						`${(index * STAGGER_SECONDS).toFixed(2)}s`,
					);
					element.removeAttribute("data-photo-pending");
					element.setAttribute("data-photo-revealed", "");
				});
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
		);

		return observerRef.current;
	}, []);

	return useCallback(
		(node: HTMLElement | null) => {
			if (!node) return;

			const observer = getObserver();
			if (!observer) {
				// Nothing may stay hidden if the observer is unavailable.
				node.removeAttribute("data-photo-pending");
				return;
			}

			observer.observe(node);
			return () => observer.unobserve(node);
		},
		[getObserver],
	);
}
