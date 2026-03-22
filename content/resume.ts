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
		title: "Product Designer & Full-Stack Builder",
		location: "Toronto, ON",
		workStatus: "Canadian Citizen - USMCA (TN) Eligible",
		photoSrc: "/images/portrait.jpg",
		photoAlt: "Robbie Patterson profile photo",
		summary:
			"Designer-developer with 5+ years building products from first wireframe to shipped code. I blend UX thinking, front-end craft, and practical automation to move ideas into production fast.",
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
				href: "/assets/Robbie_Patterson_Resume.pdf",
				download: true,
			},
		] as const,
	},
	experienceLabel: "PROFESSIONAL EXPERIENCE",
	experience: [
		{
			id: "wayward",
			company: "Wayward",
			role: "Full Stack Developer",
			location: "New York, NY (Remote)",
			start: "Feb 2024",
			end: "Jan 2026",
			highlights: [
				"Built core tooling in HTML, CSS, JavaScript, and jQuery plus Django API foundations that supported Wayward's 2025 acquisition.",
				"Shipped AI-driven backend integrations that removed workflow bottlenecks and reduced manual processing.",
				"Delivered a 30-day front-end refresh that improved load speed by 50% and accelerated partner onboarding.",
				"Built scalable React and Next.js features and owned CI/CD delivery through GitHub Actions.",
			],
		},
		{
			id: "cactus-marketing",
			company: "Cactus Marketing",
			role: "UX/UI Designer -> Full Stack Developer",
			location: "Ottawa, ON (Remote)",
			start: "Feb 2022",
			end: "Feb 2024",
			highlights: [
				"Started in UX/UI and became the go-to for product-style Webflow builds, including gated areas, CMS pages, and launch integrations.",
				"Built a custom Python automation engine for CIRA migrations, cutting manual data entry from 90 minutes to about 15 seconds per record.",
				"Led the full-stack build of Haller AI, an auth-gated SaaS platform with complex CMS architecture and third-party API integrations.",
				"Partnered with CIRA to establish CI/CD and dev/staging environments for reliable auto-deploys and faster release cycles.",
			],
		},
		{
			id: "realtyshop",
			company: "RealtyShop.ca",
			role: "UX/UI Designer Intern",
			location: "Toronto, ON (Remote)",
			start: "Apr 2021",
			end: "May 2021",
			highlights: [
				"Created complete real estate marketing packages, including custom websites and listing assets.",
				"Designed property-specific layouts aligned to each listing and agent brand with consistent visual polish.",
				"Delivered high-quality design assets under tight timelines for time-sensitive listings.",
			],
		},
		{
			id: "freelance",
			company: "Freelance",
			role: "UX/UI Designer",
			location: "Toronto, ON (Remote)",
			start: "Apr 2020",
			end: "Present",
			highlights: [
				"Improved client conversion rates by about 60% through sharper UX decisions, clearer page structure, and better interaction design.",
				"Designed and delivered end-to-end digital experiences, from early page flows to reusable component libraries, across multiple industries.",
			],
		},
	] satisfies readonly ResumeExperience[],
	skills: {
		label: "SKILLS",
		groups: [
			{
				id: "frontend",
				title: "Frontend",
				items:
					"JavaScript, jQuery, HTML5, CSS3, Responsive Design, AJAX/XHR, Accessibility (WCAG)",
			},
			{
				id: "design",
				title: "Design",
				items:
					"Figma, Adobe Suite, UI Systems, Prototyping, Conversion-Focused UX, Typography & Layout",
			},
			{
				id: "backend-platforms",
				title: "Backend & Platforms",
				items:
					"PHP, Python, Node.js, REST APIs, PostgreSQL, Webflow, WordPress",
			},
			{
				id: "performance-seo",
				title: "Performance & SEO",
				items:
					"Asset optimization, page speed tuning, lean build practices, semantic HTML",
			},
		] as const,
	},
	education: {
		label: "EDUCATION",
		degree: "Diploma, Interactive Media Design",
		institution: "Durham College, Ontario, Canada",
		details:
			"GPA 4.85/5.00 (Top Graduate, Dean's List/Honour Roll every semester).",
	},
} as const;
