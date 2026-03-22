"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	isPlainLeftClick,
	navigateWithTransition,
	PAGE_NAVIGATE_EVENT,
	type PageNavigateDetail,
} from "@/components/navigation/transition-routing";

type PageTransitionShellProps = {
	children: ReactNode;
};

type TransitionPhase = "idle" | "covering" | "revealing";

const ROUTE_EXIT_FALLBACK_MS = 540;
const ROUTE_ENTER_MS = 720;

export function PageTransitionShell({ children }: PageTransitionShellProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [phase, setPhase] = useState<TransitionPhase>("idle");
	const isTransitioningRef = useRef(false);
	const queuedHrefRef = useRef<string | null>(null);
	const pendingNavigateRef = useRef<(() => void) | null>(null);
	const exitFallbackTimerRef = useRef<number | null>(null);
	const routeContentRef = useRef<HTMLDivElement | null>(null);

	const routeKey = (() => {
		const query = searchParams.toString();
		return query ? `${pathname}?${query}` : pathname;
	})();

	const clearExitFallbackTimer = useCallback(() => {
		if (exitFallbackTimerRef.current !== null) {
			window.clearTimeout(exitFallbackTimerRef.current);
			exitFallbackTimerRef.current = null;
		}
	}, []);

	const flushPendingNavigate = useCallback(() => {
		const navigate = pendingNavigateRef.current;
		if (!navigate) return;
		pendingNavigateRef.current = null;
		clearExitFallbackTimer();
		navigate();
	}, [clearExitFallbackTimer]);

	useEffect(() => {
		const handleDocumentClick = (event: MouseEvent) => {
			if (!isPlainLeftClick(event)) return;
			if (event.defaultPrevented) return;

			const target = event.target;
			if (!(target instanceof Element)) return;

			const anchor = target.closest("a[href]");
			if (!(anchor instanceof HTMLAnchorElement)) return;
			if (anchor.target === "_blank") return;
			if (anchor.hasAttribute("download")) return;
			if (anchor.getAttribute("data-no-transition") === "true") return;

			const href = anchor.getAttribute("href");
			if (!href || href.startsWith("#")) return;

			const url = new URL(anchor.href, window.location.href);
			if (url.origin !== window.location.origin) return;

			const isHashOnlyJump =
				url.pathname === window.location.pathname &&
				url.search === window.location.search &&
				Boolean(url.hash);

			if (isHashOnlyJump) return;

			event.preventDefault();
			navigateWithTransition(router, `${url.pathname}${url.search}${url.hash}`);
		};

		const handleTransitionNavigate = (event: Event) => {
			const navigationEvent = event as CustomEvent<PageNavigateDetail>;
			const { href, navigate } = navigationEvent.detail;
			const target = new URL(href, window.location.href);
			const current = new URL(window.location.href);
			const isSameLocation =
				target.pathname === current.pathname &&
				target.search === current.search &&
				target.hash === current.hash;

			if (isSameLocation) return;

			navigationEvent.preventDefault();

			if (isTransitioningRef.current) {
				queuedHrefRef.current = href;
				return;
			}

			isTransitioningRef.current = true;
			pendingNavigateRef.current = navigate;
			setPhase("covering");
			clearExitFallbackTimer();
			exitFallbackTimerRef.current = window.setTimeout(() => {
				flushPendingNavigate();
			}, ROUTE_EXIT_FALLBACK_MS);
		};

		document.addEventListener("click", handleDocumentClick, true);
		window.addEventListener(PAGE_NAVIGATE_EVENT, handleTransitionNavigate);
		return () => {
			document.removeEventListener("click", handleDocumentClick, true);
			window.removeEventListener(PAGE_NAVIGATE_EVENT, handleTransitionNavigate);
		};
	}, [clearExitFallbackTimer, flushPendingNavigate, router]);

	useEffect(() => {
		if (phase !== "covering") return;
		const content = routeContentRef.current;
		if (!content) return;

		const onAnimationEnd = (event: AnimationEvent) => {
			if (event.animationName !== "route-content-out") return;
			flushPendingNavigate();
		};

		content.addEventListener("animationend", onAnimationEnd);
		return () => {
			content.removeEventListener("animationend", onAnimationEnd);
		};
	}, [flushPendingNavigate, phase]);

	useEffect(() => {
		if (!isTransitioningRef.current) {
			return;
		}

		const currentRouteKey = routeKey;

		const revealTimer = window.setTimeout(() => {
			setPhase("revealing");
		}, 0);

		const settleTimer = window.setTimeout(() => {
			setPhase("idle");
			isTransitioningRef.current = false;

			const queuedHref = queuedHrefRef.current;
			queuedHrefRef.current = null;

			if (queuedHref) {
				const queued = new URL(queuedHref, window.location.href);
				const queuedRouteKey = `${queued.pathname}${queued.search}`;
				if (queuedRouteKey === currentRouteKey) return;
				const current = new URL(window.location.href);
				const isSameLocation =
					queued.pathname === current.pathname &&
					queued.search === current.search &&
					queued.hash === current.hash;
				if (isSameLocation) return;
				navigateWithTransition(router, queuedHref);
			}
		}, ROUTE_ENTER_MS);

		return () => {
			window.clearTimeout(revealTimer);
			window.clearTimeout(settleTimer);
		};
	}, [routeKey, router]);

	useEffect(() => {
		return () => {
			clearExitFallbackTimer();
		};
	}, [clearExitFallbackTimer]);

	return (
		<div className={`route-stage route-stage--${phase}`}>
			<div ref={routeContentRef} className="route-content">
				{children}
			</div>
		</div>
	);
}
