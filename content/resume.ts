import { contact, contactMailto } from "@/content/home";

export type ResumeExperience = {
	id: string;
	company: string;
	role: string;
	location: string;
	start: string;
	end: string;
	highlights: readonly string[];
};

export const resumeContent = {
	header: {
		label: "RESUME",
		name: "Robbie Patterson",
		title: "UX/UI Designer & Frontend Developer",
		location: "Toronto, ON",
		workStatus: "Canadian Citizen - USMCA (TN) Eligible",
		photoSrc: "/images/portrait.jpg",
		photoAlt: "Robbie Patterson profile photo",
		summary:
			"UX/UI designer and frontend developer with 7+ years shipping production interfaces, from Figma concept to responsive code. Strong on visual craft, typography, and clean HTML, CSS, and JavaScript. Delivered ~60% average conversion lift across freelance clients and directed a team of three developers through full delivery cycles.",
		actions: [
			{ id: "email", label: "Email", href: contactMailto },
			{
				id: "linkedin",
				label: "LinkedIn",
				href: contact.linkedin,
				newTab: true,
			},
			{
				id: "download",
				label: "Download PDF",
				href: "/assets/Robbie-Patterson-Resume.pdf",
				download: true,
			},
		] as const,
	},
	experienceLabel: "PROFESSIONAL EXPERIENCE",
	experience: [
		{
			id: "wayward",
			company: "Wayward",
			role: "Frontend Developer & UI Engineer",
			location: "Remote",
			start: "Feb 2024",
			end: "Jan 2026",
			highlights: [
				"Translated Figma designs into clean, accessible, production-ready interfaces for media clients including CNN, Rolling Stone, and NBC.",
				"Led a 30-day frontend overhaul in HTML, CSS, and JavaScript that improved load performance by ~50% and accelerated partner onboarding.",
				"Owned features end to end, from design through implementation, on a component-based architecture built for consistency and speed.",
				"Directed a team of three developers through full delivery cycles and shipped an AI content tool that sped up editorial workflows by over 50%.",
			],
		},
		{
			id: "cactus-marketing",
			company: "Cactus Marketing",
			role: "UX/UI Designer & Frontend Developer",
			location: "Remote",
			start: "Feb 2022",
			end: "Feb 2024",
			highlights: [
				"Hired as a UX/UI designer and became the primary frontend builder, delivering Webflow apps with gated content, CMS-driven pages, and third-party integrations.",
				"Designed and built reusable UI component systems that standardized delivery and improved consistency across client projects.",
				"Haller AI: owned brand identity, UX strategy, and web experience, then designed and built the full Webflow app for launch.",
				"Redesigned marketing and product sites for Sapien, Matador, and TDJ Law, improving performance, accessibility, and consistency through component libraries.",
				"Led a large-scale CIRA (.ca) CMS migration with a Python automation tool that cut manual publishing from 1 to 2 hours to about 15 seconds per article.",
			],
		},
		{
			id: "freelance",
			company: "Freelance",
			role: "UX/UI Designer",
			location: "Remote",
			start: "Apr 2020",
			end: "Present",
			highlights: [
				"Improved client conversion rates by ~60% on average through strategic UI improvements and user-centered design across eCommerce and service businesses.",
				"Designed and delivered end-to-end digital experiences, including full page builds, user flows, and reusable component libraries.",
			],
		},
		{
			id: "nft-contractor",
			company: "NFT Contractor",
			role: "UX/UI Designer & Webflow Developer",
			location: "Remote",
			start: "2021",
			end: "2022",
			highlights: [
				"Designed and built high-traffic Webflow sites for NFT launches, supporting mint events and community growth under tight deadlines.",
				"Built complete brand systems, including logo, type, color, and UI, then translated Figma designs into responsive, production-ready builds.",
			],
		},
		{
			id: "realtyshop",
			company: "RealtyShop.ca",
			role: "UX/UI Designer Intern",
			location: "Remote",
			start: "Apr 2021",
			end: "May 2021",
			highlights: [
				"Designed complete real estate marketing packages, including custom property websites and visual identity systems, delivered under tight deadlines.",
			],
		},
	] satisfies readonly ResumeExperience[],
	skills: {
		label: "SKILLS",
		groups: [
			{
				id: "design-ui",
				title: "Design & UI",
				items:
					"Figma, Adobe Illustrator, Adobe Photoshop, UI/UX Design, Design Systems, Component Libraries, Typography, Visual Hierarchy, Brand Identity, Responsive Design, Accessibility (WCAG)",
			},
			{
				id: "frontend",
				title: "Frontend Development",
				items:
					"HTML, CSS, JavaScript (ES6+), Webflow, React, Next.js, TypeScript, Tailwind CSS, Cross-Browser & Performance Optimization",
			},
			{
				id: "platforms-tooling",
				title: "Platforms & Tooling",
				items:
					"CMS-Driven Builds, Third-Party Integrations, Git, Figma-to-Code Handoff, Linear, Jira, Cursor, Claude Code, Midjourney",
			},
		] as const,
	},
	education: {
		label: "EDUCATION",
		degree: "Diploma, Interactive Media Design",
		institution: "Durham College, Ontario, Canada",
		details:
			"GPA 4.85/5.00. Top Graduate, Dean's List and Honour Roll every semester.",
	},
} as const;
