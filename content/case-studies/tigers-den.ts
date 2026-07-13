import type { CaseStudy } from "@/content/case-studies/types";

export const tigersDenCaseStudy = {
	slug: "tigers-den",
	index: "02",
	name: "Tiger's Den Gym",
	tagline: "A local gym nobody could find, put on the map for free.",
	summary:
		"Tiger's Den's first brand and website, built SEO-first to fill classes on organic search with no ad budget behind it.",
	accent: "#c21807",
	liveUrl: "https://tigersden.webflow.io/",
	hero: {
		src: "/images/projects/tigers-den/tigers-den-thumbnail.png",
		alt: "Tiger's Den Gym homepage",
		caption: "Homepage · shipped on Webflow",
	},
	meta: [
		{
			label: "Role",
			kind: "tags",
			tags: ["Branding", "Photography", "SEO", "UX/UI", "Frontend"],
		},
		{
			label: "Timeline",
			kind: "text",
			value: "3 weeks",
		},
		{
			label: "Client",
			kind: "text",
			value: "Tiger's Den Gym · Oshawa, ON",
		},
		{
			label: "Stack",
			kind: "text",
			value: "Figma · Webflow · Google Analytics",
		},
	],
	sections: [
		{
			id: "setup",
			label: "The setup",
			type: "brief",
			pull: "A gym with a real reputation in the room and a total blank outside it.",
			situation:
				"Tiger's Den filled classes on word of mouth alone. No website, no search footprint, no map listing. If you didn't already know someone who trained there, the place may as well not have existed.",
			ask: "Give the gym its first real identity and online presence, then use it to turn a local search into someone standing in the gym for a free class.",
		},
		{
			id: "corner",
			label: "The corner",
			type: "constraints",
			intro:
				"Three limits set the whole approach before a single page got designed.",
			items: [
				{
					label: "Budget",
					value: "Small business, no retainer, no room for a custom build.",
					consequence:
						"Webflow, so the owner edits schedules and pricing himself without ever calling me.",
				},
				{
					label: "Starting point",
					value: "No site, no brand, no photos, no copy. A blank canvas.",
					consequence:
						"Everything got built from zero, identity first, then the pages on top of it.",
				},
				{
					label: "Marketing",
					value: "No budget for ads or paid social. Zero.",
					consequence:
						"If a visit didn't come from organic search or the map, it wasn't going to come at all.",
				},
			],
		},
		{
			id: "gameplan",
			label: "The gameplan",
			type: "decisions",
			items: [
				{
					n: 1,
					num: "1",
					title: "Build the brand before the site.",
					call: "I designed the identity first. The tiger mark, the logo lockup, the red, and the type, then built everything else on top of it.",
					why: "A gym's brand lives on gloves, hoodies, and the banner over the door long before anyone sees a screen. One mark that holds up everywhere meant no second logo project a year later.",
					tradeoff:
						"Spending the first stretch on identity looks slow. It paid off the moment every page already knew what it should look like.",
					image: {
						src: "/images/projects/tigers-den/tigers-den-brand.png",
						alt: "Tiger's Den brand board: tiger mark, logo lockup, color, and type",
						orientation: "landscape",
						width: 2048,
						height: 1463,
					},
				},
				{
					n: 2,
					num: "2",
					title: "Engineer the whole thing to get found.",
					call: "Pages are built around real local intent. Boxing and kickboxing in Oshawa, classes by age, schedule, pricing, location. Then I set up the Google Business profile so the gym shows in Maps and the local pack too.",
					why: "Local gym searches are high intent. People want times, price, and a way in. A lot of that discovery never even reaches a website, it happens in Maps. Owning both is what puts a no-name gym in front of the person searching two blocks away.",
					image: {
						src: "/images/projects/tigers-den/tigers-den-site.png",
						alt: "Tiger's Den homepage built around classes, schedule, and location",
						orientation: "landscape",
						width: 2048,
						height: 1463,
					},
				},
				{
					n: 3,
					num: "3",
					title: "Point everything at one free class.",
					call: "Every section funnels to the same action. Book First Class Free. No newsletter, no ten links, no online checkout competing for the click.",
					why: "The first visit is the whole conversion. Train once and the room sells itself. So the entire site drives that single free trial instead of splitting attention across a dozen calls to action.",
					tradeoff:
						"It leaves online membership sales on the table up front. A booked class closes far better in person than a checkout ever would.",
				},
			],
		},
		{
			id: "payoff",
			label: "The payoff",
			type: "spotlight",
			heading: "A gym with no ad budget, found on Google every day.",
			metric: {
				value: "16,847",
				label: "users found the gym since launch, with zero ad spend behind it",
			},
			steps: ["Search", "Land", "Book free class", "Walk in"],
			body: "This is what the SEO-first build bought. Organic search leads every channel at 62%, more than 10,000 users landing straight from Google, and not a dollar spent on ads. The pages and the map listing do the work most gyms pay to rent.",
			media: {
				src: "/images/projects/tigers-den/tigers-den-analytics.png",
				alt: "Google Analytics showing organic search leading the gym's traffic",
				orientation: "portrait",
			},
		},
		{
			id: "den",
			label: "Inside the den",
			type: "media",
			caption:
				"Coach Tiger runs the room with close to 30 years in the sport and a black belt in Taekwondo and Hapkido. The brand and the site had to live up to what actually happens inside these walls.",
			items: [
				{
					id: "fighter-1",
					src: "/images/projects/tigers-den/tigers-den-fighter-1.png",
					alt: "Tiger's Den fighter portrait",
					width: 1463,
					height: 2048,
				},
				{
					id: "fighter-2",
					src: "/images/projects/tigers-den/tigers-den-fighter-2.png",
					alt: "Tiger's Den fighter portrait",
					width: 1463,
					height: 2048,
				},
				{
					id: "fighter-3",
					src: "/images/projects/tigers-den/tigers-den-fighter-3.png",
					alt: "Tiger's Den fighter portrait",
					width: 1463,
					height: 2048,
				},
				{
					id: "gym",
					src: "/images/projects/tigers-den/tigers-den-gym.png",
					alt: "The Tiger's Den team together in front of the ring",
					width: 2048,
					height: 1463,
				},
			],
		},
		{
			id: "standing",
			label: "Where it stands",
			type: "outcome",
			metrics: [
				{
					value: "62%",
					label: "From organic search, the top channel by far",
				},
				{
					value: "$0",
					label: "Spent on ads or paid social, ever",
				},
				{
					value: "First",
					label: "Website and search presence in the gym's history",
				},
			],
			shipped: "Shipped · the gym's first website · still running on organic",
		},
	],
} as const satisfies CaseStudy;
