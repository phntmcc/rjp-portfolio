"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ROUTE_SETTLED_EVENT } from "@/components/navigation/transition-routing";

const ROUTE_IN_ANIMATIONS = new Set([
	"route-content-in",
	"route-content-forward-in",
	"route-content-backward-in",
]);

const RAIL_LAYOUT_PASS_DELAYS_MS = [50, 150, 400, 800, 1500] as const;
const REVEAL_PASS_DELAYS_MS = [50, 150, 400] as const;

function countUpMetrics(sectionEl: HTMLElement) {
	const elements = sectionEl.querySelectorAll(".metric-value");
	elements.forEach((element, index) => {
		const target = element.textContent;
		if (!target) return;

		const numberPattern = /\d+/g;
		const numbers = target.match(numberPattern);
		if (!numbers) return;

		const duration = 1000;
		const stagger = index * 90;
		const start = performance.now() + stagger;

		const frame = (now: number) => {
			if (now < start) {
				requestAnimationFrame(frame);
				return;
			}

			const progress = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - progress) ** 3;
			let numberIndex = 0;

			element.textContent = target.replace(numberPattern, (match) => {
				const value = Math.round(
					Number.parseInt(numbers[numberIndex] ?? match, 10) * eased,
				);
				numberIndex += 1;
				return String(value);
			});

			if (progress < 1) {
				requestAnimationFrame(frame);
			} else {
				element.textContent = target;
			}
		};

		requestAnimationFrame(frame);
	});
}

function revealElement(el: HTMLElement, reduceMotion: boolean) {
	if (!el.hasAttribute("data-rv-pending")) return;

	const delay = el.dataset.rvDelay ?? "0";
	el.removeAttribute("data-rv-pending");
	el.dataset.rvSeen = "1";

	if (reduceMotion) {
		el.style.transition = "none";
		el.style.opacity = "1";
		el.style.transform = "none";
	} else {
		el.style.transition = `opacity 0.9s var(--ease-out-quint) ${delay}s, transform 0.9s var(--ease-out-quint) ${delay}s`;
		el.style.opacity = "1";
		el.style.transform = "translateY(0)";
	}

	if (el.dataset.rvKey === "outcome" && !reduceMotion) {
		countUpMetrics(el);
	}
}

function resetRevealElements(root: ParentNode | null) {
	if (!root) return;

	root.querySelectorAll("[data-rv-key]").forEach((element) => {
		const el = element as HTMLElement;
		delete el.dataset.rvSeen;
		el.setAttribute("data-rv-pending", "");
		el.style.transition = "none";
		el.style.opacity = "";
		el.style.transform = "";
	});
}

function resetHeroSticky() {
	const heroSticky = document.getElementById("heroSticky");
	if (!heroSticky) return;
	heroSticky.style.transform = "none";
	heroSticky.style.filter = "none";
	heroSticky.style.opacity = "1";
}

function resetRailGeometry() {
	const track = document.getElementById("railTrack");
	const line = document.getElementById("railLine");
	const fill = document.getElementById("railFill");

	if (track) {
		delete track.dataset.railSpan;
	}

	if (line) {
		line.style.top = "";
		line.style.height = "";
	}

	if (fill) {
		fill.style.top = "";
		fill.style.height = "0px";
	}
}

function queryRevealElements(root: ParentNode | null) {
	if (!root) return [];
	return Array.from(
		root.querySelectorAll("[data-rv-pending]"),
	) as HTMLElement[];
}

function getDotCenterY(track: HTMLElement, dot: Element) {
	const trackRect = track.getBoundingClientRect();
	const dotRect = dot.getBoundingClientRect();
	return dotRect.top + dotRect.height / 2 - trackRect.top;
}

function getRailSpanHeight() {
	const track = document.getElementById("railTrack");
	if (!track?.dataset.railSpan) return 0;
	return Number.parseFloat(track.dataset.railSpan);
}

function layoutRail() {
	const track = document.getElementById("railTrack");
	const line = document.getElementById("railLine");
	if (!track || !line) {
		return false;
	}

	const dots = track.querySelectorAll(".rail-dot");
	if (dots.length === 0) {
		return false;
	}

	const first = dots[0];
	const last = dots[dots.length - 1];
	const top = getDotCenterY(track, first);
	const bottom = getDotCenterY(track, last);
	const span = bottom - top;

	if (span <= 0) {
		return false;
	}

	line.style.top = `${top.toFixed(1)}px`;
	line.style.height = `${span.toFixed(1)}px`;
	track.dataset.railSpan = span.toFixed(1);

	const fill = document.getElementById("railFill");
	if (fill) {
		fill.style.top = `${top.toFixed(1)}px`;
	}

	return true;
}

function updateRailFill() {
	const fill = document.getElementById("railFill");
	if (!fill) return;

	let span = getRailSpanHeight();
	if (span <= 0) {
		layoutRail();
		span = getRailSpanHeight();
	}
	if (span <= 0) return;

	const viewportHeight = window.innerHeight;
	const maxScroll = document.documentElement.scrollHeight - viewportHeight;
	const scrollProgress = Math.min(
		1,
		Math.max(0, window.scrollY / Math.max(1, maxScroll)),
	);
	fill.style.height = `${(span * scrollProgress).toFixed(1)}px`;
}

type UseCaseStudyScrollOptions = {
	resetKey: string;
	rootRef: React.RefObject<HTMLElement | null>;
	onActiveSectionChange?: (sectionId: string | null) => void;
};

export function useCaseStudyScroll({
	resetKey,
	rootRef,
	onActiveSectionChange,
}: UseCaseStudyScrollOptions) {
	const rafRef = useRef<number | null>(null);
	const activeIdRef = useRef<string | null>(null);
	const reduceMotionRef = useRef(false);
	const timersRef = useRef<number[]>([]);
	const initTokenRef = useRef(0);
	const onActiveSectionChangeRef = useRef(onActiveSectionChange);

	useLayoutEffect(() => {
		onActiveSectionChangeRef.current = onActiveSectionChange;
	});

	const revealAllForced = useCallback(() => {
		const reduceMotion = reduceMotionRef.current;
		for (const el of queryRevealElements(rootRef.current)) {
			revealElement(el, reduceMotion);
		}
	}, [rootRef]);

	const revealInViewport = useCallback(() => {
		const root = rootRef.current;
		if (!root) return;

		const reduceMotion = reduceMotionRef.current;
		const viewportHeight = window.innerHeight;

		for (const el of queryRevealElements(root)) {
			if (
				reduceMotion ||
				el.getBoundingClientRect().top < viewportHeight * 0.92
			) {
				revealElement(el, reduceMotion);
			}
		}
	}, [rootRef]);

	const onScroll = useCallback(() => {
		if (rafRef.current !== null) return;

		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;

			const viewportHeight = window.innerHeight;
			const root = rootRef.current;

			const heroSticky = document.getElementById("heroSticky");
			const railWrap = document.getElementById("railArticleWrap");

			if (heroSticky && railWrap && !reduceMotionRef.current) {
				const railTop = railWrap.getBoundingClientRect().top;
				const startAt = viewportHeight * 0.62;
				const endAt = 64;
				const progress = Math.max(
					0,
					Math.min(1, (startAt - railTop) / (startAt - endAt)),
				);

				if (progress <= 0.001) {
					heroSticky.style.transform = "none";
					heroSticky.style.filter = "none";
					heroSticky.style.opacity = "1";
				} else {
					heroSticky.style.transform = `translateY(${(16 * progress).toFixed(1)}px) scale(${(1 - 0.05 * progress).toFixed(3)})`;
					heroSticky.style.filter = `blur(${(6 * progress).toFixed(2)}px)`;
					heroSticky.style.opacity = (1 - 0.5 * progress).toFixed(3);
				}
			}

			document.querySelectorAll(".dec-watermark").forEach((element) => {
				const rect = element.getBoundingClientRect();
				const offset = (rect.top - viewportHeight / 2) * 0.06;
				(element as HTMLElement).style.transform =
					`translateY(${offset.toFixed(1)}px)`;
			});

			updateRailFill();

			if (root) {
				const reduceMotion = reduceMotionRef.current;
				for (const el of queryRevealElements(root)) {
					if (
						reduceMotion ||
						el.getBoundingClientRect().top < viewportHeight * 0.92
					) {
						revealElement(el, reduceMotion);
					}
				}
			}

			const sections = Array.from(
				document.querySelectorAll("section[id^='sec-']"),
			);
			const scanline = viewportHeight * 0.3;
			let activeId: string | null = null;

			for (const section of sections) {
				const rect = section.getBoundingClientRect();
				if (rect.top <= scanline && rect.bottom > scanline) {
					activeId = section.id.replace("sec-", "");
					break;
				}
			}

			if (!activeId && sections.length > 0) {
				const first = sections[0].getBoundingClientRect();
				activeId =
					scanline < first.top
						? sections[0].id.replace("sec-", "")
						: sections[sections.length - 1].id.replace("sec-", "");
			}

			if (activeId && activeId !== activeIdRef.current) {
				activeIdRef.current = activeId;
				onActiveSectionChangeRef.current?.(activeId);
			}
		});
	}, [rootRef]);

	const onScrollRef = useRef(onScroll);
	const revealAllForcedRef = useRef(revealAllForced);
	const revealInViewportRef = useRef(revealInViewport);

	useLayoutEffect(() => {
		onScrollRef.current = onScroll;
		revealAllForcedRef.current = revealAllForced;
		revealInViewportRef.current = revealInViewport;
	}, [onScroll, revealAllForced, revealInViewport]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resetKey is the sole lifecycle trigger for case study navigation
	useEffect(() => {
		const initToken = ++initTokenRef.current;
		const isCurrent = () => initToken === initTokenRef.current;
		let finalizePending = false;

		reduceMotionRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		activeIdRef.current = null;
		window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		resetRevealElements(rootRef.current);
		resetHeroSticky();
		resetRailGeometry();

		const clearTimers = () => {
			for (const timer of timersRef.current) {
				window.clearTimeout(timer);
			}
			timersRef.current = [];
		};

		const schedulePasses = (run: () => void, delays: readonly number[]) => {
			run();
			requestAnimationFrame(run);
			for (const delay of delays) {
				timersRef.current.push(
					window.setTimeout(() => {
						if (!isCurrent()) return;
						run();
					}, delay),
				);
			}
		};

		const finalizeAfterNavigation = () => {
			if (!isCurrent() || finalizePending) return;
			finalizePending = true;

			window.requestAnimationFrame(() => {
				finalizePending = false;
				if (!isCurrent()) return;

				window.scrollTo({ top: 0, left: 0, behavior: "auto" });
				resetHeroSticky();
				resetRailGeometry();
				layoutRail();
				updateRailFill();
				revealAllForcedRef.current();
				onScrollRef.current();
				schedulePasses(() => {
					layoutRail();
					updateRailFill();
					revealInViewportRef.current();
					onScrollRef.current();
				}, RAIL_LAYOUT_PASS_DELAYS_MS);
			});
		};

		const handleResize = () => {
			if (!isCurrent()) return;
			layoutRail();
			updateRailFill();
			onScrollRef.current();
		};

		const onRouteAnimationEnd = (event: Event) => {
			const animationEvent = event as AnimationEvent;
			if (!ROUTE_IN_ANIMATIONS.has(animationEvent.animationName)) return;

			const target = animationEvent.target;
			if (!(target instanceof Element)) return;
			if (!target.closest(".route-content")) return;

			finalizeAfterNavigation();
		};

		const handleRouteSettled = () => {
			finalizeAfterNavigation();
		};

		const scrollHandler = () => {
			onScrollRef.current();
		};

		window.addEventListener("scroll", scrollHandler, { passive: true });
		window.addEventListener("resize", handleResize);
		window.addEventListener(ROUTE_SETTLED_EVENT, handleRouteSettled);
		document.addEventListener("animationend", onRouteAnimationEnd);

		const track = document.getElementById("railTrack");
		const resizeObserver =
			typeof ResizeObserver !== "undefined" && track
				? new ResizeObserver(() => {
						if (!isCurrent()) return;
						layoutRail();
						updateRailFill();
					})
				: null;

		resizeObserver?.observe(track as Element);

		schedulePasses(() => {
			revealInViewportRef.current();
		}, REVEAL_PASS_DELAYS_MS);

		const routeStage = document.querySelector(".route-stage");
		if (
			!routeStage?.classList.contains("route-stage--revealing") &&
			!routeStage?.classList.contains("route-stage--covering")
		) {
			finalizeAfterNavigation();
		}

		return () => {
			clearTimers();
			window.removeEventListener("scroll", scrollHandler);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener(ROUTE_SETTLED_EVENT, handleRouteSettled);
			document.removeEventListener("animationend", onRouteAnimationEnd);
			resizeObserver?.disconnect();
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [resetKey, rootRef]);

	return { layoutRail, onScroll };
}
