"use client";

import {
	type CSSProperties,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { AmbientBackground } from "@/components/case-study/ambient-background";
import { CaseStudyArticle } from "@/components/case-study/case-study-article";
import { CaseStudyFooterNav } from "@/components/case-study/case-study-footer-nav";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import {
	CaseStudyMobileRail,
	CaseStudyRail,
} from "@/components/case-study/case-study-rail";
import { ScrollReveal } from "@/components/case-study/scroll-reveal";
import {
	buildSectionManifest,
	type CaseStudy,
	type CaseStudyNeighbors,
} from "@/content/case-studies";
import { useCaseStudyScroll } from "@/hooks/use-case-study-scroll";
import { brandFaviconDataUrl } from "@/lib/brand-mark";
import { PAGE_BOTTOM_PADDING_CLASS } from "@/lib/layout-constants";

type CaseStudyPageProps = {
	caseStudy: CaseStudy;
	neighbors: CaseStudyNeighbors;
};

function formatActiveCount(activeIndex: number, total: number) {
	const pad = (value: number) => String(value).padStart(2, "0");
	return `${pad(activeIndex + 1)}/${pad(total)}`;
}

export function CaseStudyPage({ caseStudy, neighbors }: CaseStudyPageProps) {
	const pageRootRef = useRef<HTMLElement>(null);

	const sections = useMemo(() => buildSectionManifest(caseStudy), [caseStudy]);

	const [activeSectionId, setActiveSectionId] = useState<string | null>(
		sections[0]?.id ?? null,
	);

	const handleActiveSectionChange = useCallback((sectionId: string | null) => {
		if (!sectionId) return;
		setActiveSectionId(sectionId);
	}, []);

	useCaseStudyScroll({
		resetKey: caseStudy.slug,
		rootRef: pageRootRef,
		onActiveSectionChange: handleActiveSectionChange,
	});

	const activeIndex = sections.findIndex(
		(section) => section.id === activeSectionId,
	);
	const activeCount = formatActiveCount(
		activeIndex === -1 ? 0 : activeIndex,
		sections.length,
	);
	const readingNow =
		sections.find((section) => section.id === activeSectionId)?.label ??
		sections[0]?.label ??
		"";

	const caseIndex = `${caseStudy.index} / ${String(neighbors.total).padStart(2, "0")}`;

	const accentStyle = caseStudy.accent
		? ({ "--accent": caseStudy.accent } as CSSProperties)
		: undefined;

	// Propagate the brand accent to the document root so shared chrome outside
	// this page (the header mark, the body-portaled ambient blob) inherits it.
	const accent = caseStudy.accent;
	useEffect(() => {
		if (!accent) return;
		const root = document.documentElement;
		const previous = root.style.getPropertyValue("--accent");
		root.style.setProperty("--accent", accent);
		return () => {
			if (previous) {
				root.style.setProperty("--accent", previous);
			} else {
				root.style.removeProperty("--accent");
			}
		};
	}, [accent]);

	// Recolor the browser-tab favicon to match the brand accent while this
	// case study is open, then restore the original on navigate-away.
	useEffect(() => {
		if (!accent) return;
		const href = brandFaviconDataUrl(accent);
		const links = Array.from(
			document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
		);

		if (links.length === 0) {
			const link = document.createElement("link");
			link.rel = "icon";
			link.type = "image/svg+xml";
			link.href = href;
			document.head.appendChild(link);
			return () => link.remove();
		}

		const originals = links.map((link) => ({
			link,
			href: link.getAttribute("href"),
			type: link.getAttribute("type"),
		}));
		for (const link of links) {
			link.setAttribute("type", "image/svg+xml");
			link.setAttribute("href", href);
		}
		return () => {
			for (const { link, href: originalHref, type } of originals) {
				if (originalHref === null) {
					link.removeAttribute("href");
				} else {
					link.setAttribute("href", originalHref);
				}
				if (type === null) {
					link.removeAttribute("type");
				} else {
					link.setAttribute("type", type);
				}
			}
		};
	}, [accent]);

	const scrollToSection = useCallback((sectionId: string) => {
		const element = document.getElementById(`sec-${sectionId}`);
		if (!element) return;
		const offset = window.innerWidth >= 1024 ? 120 : 136;
		const top = element.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: "smooth" });
	}, []);

	return (
		<>
			<AmbientBackground />

			<main
				ref={pageRootRef}
				id="pageRoot"
				style={accentStyle}
				className={`case-study-page relative z-1 ${PAGE_BOTTOM_PADDING_CLASS}`}
			>
				<CaseStudyHero caseStudy={caseStudy} caseIndex={caseIndex} />

				<div id="railArticleWrap" className="relative z-2">
					<CaseStudyMobileRail
						sections={sections}
						activeSectionId={activeSectionId}
						onSectionClick={scrollToSection}
					/>

					<div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
						<CaseStudyRail
							sections={sections}
							activeSectionId={activeSectionId}
							activeCount={activeCount}
							readingNow={readingNow}
							onSectionClick={scrollToSection}
						/>

						<article className="min-w-0">
							<CaseStudyArticle caseStudy={caseStudy} />
						</article>
					</div>
				</div>

				<ScrollReveal revealKey="footer">
					<CaseStudyFooterNav neighbors={neighbors} />
				</ScrollReveal>
			</main>
		</>
	);
}
