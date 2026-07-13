export const site = {
	name: "Robbie Patterson",
	title: "Robbie Patterson — UX/UI Designer & Frontend Developer",
	description:
		"UX/UI designer and frontend developer. I turn Figma concepts into shipped, responsive code, then chase stories through a camera lens.",
} as const;

/** Single source of truth for profile contact links (email + social). */
export const contact = {
	email: "robbie@robbiejpatterson.com",
	linkedin: "https://www.linkedin.com/in/robbiejpatterson/",
	github: "https://github.com/phntmcc/",
} as const;

export const contactMailto = `mailto:${contact.email}` as const;

export const homeContent = {
	hero: {
		badge: "OPEN TO WORK",
		headlineLead: "I design interfaces, ",
		headlineAccent: "then capture moments.",
		subhead:
			"UX/UI designer and frontend developer with 7+ years turning Figma concepts into shipped, responsive code. Off the clock, I'm behind a camera.",
	},
	toolkit: {
		label: "CURRENT TOOLKIT",
		items: [
			{
				id: "figma",
				label: "Figma",
				src: "/icons/brands/figma-icon.svg",
				experienceStartYear: 2020,
			},
			{
				id: "illustrator",
				label: "Adobe Illustrator",
				src: "/icons/brands/illustrator-icon.svg",
				experienceStartYear: 2015,
			},
			{
				id: "photoshop",
				label: "Adobe Photoshop",
				src: "/icons/brands/photoshop-icon.svg",
				experienceStartYear: 2015,
			},
			{
				id: "html",
				label: "HTML",
				src: "/icons/brands/html-icon.svg",
				experienceStartYear: 2018,
			},
			{
				id: "css",
				label: "CSS",
				src: "/icons/brands/css-icon.svg",
				experienceStartYear: 2018,
			},
			{
				id: "javascript",
				label: "JavaScript",
				src: "/icons/brands/javascript-icon.svg",
				experienceStartYear: 2019,
			},
			{
				id: "react",
				label: "React",
				src: "/icons/brands/react-icon.svg",
				experienceStartYear: 2025,
			},
			{
				id: "nextjs",
				label: "Next.js",
				src: "/icons/brands/nextjs-logo.svg",
				experienceStartYear: 2025,
			},
			{
				id: "typescript",
				label: "TypeScript",
				src: "/icons/brands/typescript-icon.svg",
				experienceStartYear: 2025,
			},
			{
				id: "tailwind",
				label: "Tailwind CSS",
				src: "/icons/brands/tailwind-icon.svg",
				experienceStartYear: 2024,
			},
			{
				id: "webflow",
				label: "Webflow",
				src: "/icons/brands/webflow-icon.svg",
				experienceStartYear: 2021,
			},
			{
				id: "git",
				label: "Git",
				src: "/icons/brands/git-icon.svg",
				experienceStartYear: 2020,
			},
		] as const,
	},
	connect: {
		label: "CONNECT",
		links: [
			{
				id: "linkedin",
				label: "LinkedIn",
				href: contact.linkedin,
				icon: "linkedin" as const,
				newTab: true,
			},
			{
				id: "github",
				label: "GitHub",
				href: contact.github,
				icon: "github" as const,
				newTab: true,
			},
			{
				id: "email",
				label: "Email",
				href: contactMailto,
				icon: "mail" as const,
				wide: true,
			},
		],
	},
	location: {
		label: "Current Location",
		place: "Toronto, ON",
		lat: 43.653226,
		lng: -79.3831843,
		mapZoom: 12,
	},
	dock: [
		{
			id: "home",
			label: "Home",
			href: "/",
			icon: "home" as const,
		},
		{
			id: "projects",
			label: "Projects",
			href: "/projects",
			icon: "layers" as const,
		},
		{
			id: "photography",
			label: "Photography",
			href: "/photography",
			icon: "camera" as const,
		},
		{
			id: "github",
			label: "GitHub",
			href: contact.github,
			icon: "github" as const,
			newTab: true,
		},
		{
			id: "linkedin",
			label: "LinkedIn",
			href: contact.linkedin,
			icon: "linkedin" as const,
			newTab: true,
		},
		{
			id: "resume",
			label: "Resume",
			href: "/resume",
			icon: "file-text" as const,
		},
	],
	command: [
		{ id: "home", label: "Home", href: "#", keywords: "top" },
		{
			id: "resume",
			label: "Resume",
			href: "/resume",
			keywords: "cv experience education skills",
		},
		{
			id: "projects",
			label: "Projects",
			href: "/projects",
			keywords: "work portfolio",
		},
		{
			id: "photo",
			label: "Photography",
			href: "/photography",
			keywords: "gallery",
		},
		{ id: "connect", label: "Connect", href: "#connect", keywords: "social" },
		{
			id: "gh",
			label: "GitHub profile",
			href: contact.github,
			keywords: "code",
		},
		{
			id: "li",
			label: "LinkedIn profile",
			href: contact.linkedin,
			keywords: "network social",
		},
	],
} as const;
