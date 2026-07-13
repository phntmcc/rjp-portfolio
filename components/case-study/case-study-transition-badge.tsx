"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BodyPortal } from "@/components/case-study/body-portal";
import type { PageNavigateDetail } from "@/components/navigation/transition-routing";
import {
	PAGE_NAVIGATE_EVENT,
	ROUTE_SETTLED_EVENT,
} from "@/components/navigation/transition-routing";

const SCRAMBLE_DURATION_MS = 600;
const HOLD_AFTER_SETTLED_MS = 1100;
const MAX_VISIBLE_MS = 3200;

/** Dock sits at bottom-6 with ~4.875rem content; gap above it for the badge. */
const BADGE_BOTTOM_CLASS = "bottom-[calc(1.5rem+4.875rem+0.75rem)]";

function scrambleReveal(
	element: HTMLElement,
	target: string,
	duration: number,
) {
	const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const len = target.length;
	const start = performance.now();

	const frame = (now: number) => {
		const progress = Math.min(1, (now - start) / duration);
		const eased = 1 - (1 - progress) ** 2.2;
		let output = "";

		for (let i = 0; i < len; i++) {
			const char = target[i];
			const revealAt = (i / len) * 0.7;
			if (
				char === " " ||
				char === "." ||
				char === "'" ||
				char === "-" ||
				eased >= revealAt + 0.18
			) {
				output += char;
			} else {
				output += glyphs[Math.floor(Math.random() * glyphs.length)];
			}
		}

		element.textContent = output;
		if (progress < 1) {
			requestAnimationFrame(frame);
		} else {
			element.textContent = target;
		}
	};

	requestAnimationFrame(frame);
}

export function CaseStudyTransitionBadge() {
	const [visible, setVisible] = useState(false);
	const [label, setLabel] = useState("Next");
	const [direction, setDirection] = useState<"forward" | "backward">("forward");
	const nameRef = useRef<HTMLSpanElement>(null);
	const hideTimerRef = useRef<number | null>(null);
	const isActiveRef = useRef(false);

	useEffect(() => {
		const clearHideTimer = () => {
			if (hideTimerRef.current !== null) {
				window.clearTimeout(hideTimerRef.current);
				hideTimerRef.current = null;
			}
		};

		const scheduleHide = (delay: number) => {
			clearHideTimer();
			hideTimerRef.current = window.setTimeout(() => {
				setVisible(false);
				isActiveRef.current = false;
			}, delay);
		};

		const handleNavigate = (event: Event) => {
			const navigationEvent = event as CustomEvent<PageNavigateDetail>;
			const { direction: navDirection, destinationName } =
				navigationEvent.detail;
			if (!navDirection || !destinationName) return;

			clearHideTimer();
			isActiveRef.current = true;
			setDirection(navDirection);
			setLabel(navDirection === "forward" ? "Next" : "Previous");
			setVisible(true);

			if (nameRef.current) {
				nameRef.current.textContent = "";
				scrambleReveal(nameRef.current, destinationName, SCRAMBLE_DURATION_MS);
			}

			scheduleHide(MAX_VISIBLE_MS);
		};

		const handleRouteSettled = () => {
			if (!isActiveRef.current) return;
			scheduleHide(HOLD_AFTER_SETTLED_MS);
		};

		window.addEventListener(PAGE_NAVIGATE_EVENT, handleNavigate);
		window.addEventListener(ROUTE_SETTLED_EVENT, handleRouteSettled);

		return () => {
			window.removeEventListener(PAGE_NAVIGATE_EVENT, handleNavigate);
			window.removeEventListener(ROUTE_SETTLED_EVENT, handleRouteSettled);
			clearHideTimer();
		};
	}, []);

	const DirectionIcon = direction === "forward" ? ArrowUpRight : ArrowDownLeft;

	return (
		<BodyPortal>
			<div
				aria-hidden
				className={`pointer-events-none fixed inset-x-0 ${BADGE_BOTTOM_CLASS} z-30 flex justify-center px-4`}
			>
				<div
					className={`cs-nav-badge inline-flex max-w-[min(100%,24rem)] items-center gap-2 rounded-full border border-white/8 bg-black/60 px-3 py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl ${
						visible ? "cs-nav-badge--visible" : "cs-nav-badge--hidden"
					}`}
				>
					<DirectionIcon
						className="size-3 shrink-0 text-neutral-500"
						strokeWidth={1.75}
						aria-hidden
					/>
					<span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
						{label}
					</span>
					<span aria-hidden className="text-[10px] text-neutral-700">
						·
					</span>
					<span
						ref={nameRef}
						className="min-w-0 truncate font-serif text-[14px] leading-tight text-neutral-100"
					/>
				</div>
			</div>
		</BodyPortal>
	);
}
