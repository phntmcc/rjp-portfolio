import type { CaseStudy } from "@/content/case-studies/types";

export const scopeguardCaseStudy = {
	slug: "scopeguard",
	index: "01",
	name: "ScopeGuard",
	tagline: "Scope changes, documented before they become disputes.",
	summary:
		"A field-first app for contractors to capture scope changes on site and turn a spoken note into a client-ready contract in under a second.",
	accent: "#0052ff",
	hero: {
		src: "/images/projects/scopeguard/scopeguard-thumbnail.png",
		alt: "ScopeGuard voice-first scope capture screen",
		caption: "Capture screen · working prototype",
	},
	meta: [
		{
			label: "Role",
			kind: "tags",
			tags: ["UX/UI", "Branding", "Frontend", "Backend"],
		},
		{
			label: "Timeline",
			kind: "text",
			value: "2026 · working prototype, in polish",
		},
		{
			label: "Client",
			kind: "text",
			value: "Self initiated",
		},
		{
			label: "Stack",
			kind: "text",
			value:
				"Figma · React · Next.js · TypeScript · Supabase · Claude Code · Cursor",
		},
	],
	sections: [
		{
			id: "brief",
			label: "The problem",
			type: "brief",
			pull: "Contractors don't lose change order money because they can't write documents. They lose it because nobody writes documents on a roof.",
			situation:
				"On site scope changes get agreed out loud and written down never. By invoice time it's the contractor's memory against the client's, and the contractor usually eats the difference. It's one of the quietest ways a trade business leaks margin.",
			ask: "Capture a scope change on site in seconds, hands full, and turn it into a document a client will actually read and sign. Self initiated. No client, no brief, just a problem worth solving.",
		},
		{
			id: "loop",
			label: "The loop",
			type: "spotlight",
			heading: "Talk for thirty seconds. Get a finished contract back.",
			metric: {
				value: "750ms",
				label: "From a spoken note to a finished contract",
			},
			steps: ["Speak", "Transcribe", "Generate", "Send"],
			body: "The whole product is one loop. A contractor records what changed, ScopeGuard transcribes it and writes a client-ready contract in about 750 milliseconds, and they review and send. No forms, no typing on a ladder, no waiting.",
			media: {
				src: "/images/projects/scopeguard/scopeguard-demo3.png",
				alt: "ScopeGuard generated contract screen",
				orientation: "portrait",
			},
		},
		{
			id: "decisions",
			label: "Key decisions",
			type: "decisions",
			items: [
				{
					n: 1,
					num: "1",
					title: "Voice is the product, not a feature of it.",
					call: "The home screen is one record button. Templates, history, and client details all live behind it.",
					why: "There's a short window after a change is agreed on site before the crew moves on and the detail is gone. Forms lose that window. Talking for thirty seconds doesn't. So the fastest possible capture had to be the default, not an option.",
					tradeoff:
						"It means no template picker up front. That choice moves to the review step, where there's actually attention to spend.",
					image: {
						src: "/images/projects/scopeguard/scopeguard-demo1.png",
						alt: "ScopeGuard voice capture home screen",
					},
				},
				{
					n: 2,
					num: "2",
					title: "Capture on the roof, compose at the truck.",
					call: "The flow splits into two moments. Raw capture in the field, review and send from the vehicle or the office.",
					why: "Capture and composing are different mental states. One is urgent and physical, the other is careful. Forcing both into a single flow gets the wrong posture for each. Splitting them mirrors how crews already work with paper.",
					tradeoff:
						"Two moments means a change can sit unsent. A quiet end of day reminder covers that without nagging.",
				},
				{
					n: 3,
					num: "3",
					title: "Generated docs sound plain, not polished.",
					call: "Output is written to match real change orders. Short sentences, trade vocabulary, no marketing tone.",
					why: "Clients sign what sounds like their contractor. Copy that reads like a marketing team wrote it invites suspicion. Plain language reads as trustworthy, and trustworthy gets signed.",
					tradeoff:
						"It looks less impressive in a design demo. The people it's actually for don't care.",
				},
				{
					n: 4,
					num: "4",
					title: "The brand came before the app.",
					call: "Before a single screen, I built the identity. Logo, icon, the #0052ff blue, and the type system came first, then the product was designed on top of that foundation.",
					why: "Every decision above sits on the brand. The blue only marks money states because the identity decided color has to carry meaning, not decoration. The plain, high contrast screens come straight from a system built for a work site, not a pitch deck. Setting the brand first meant the interface never had to guess what it should feel like. The full style guide, logo, icon, color, and fonts, is the reference the whole app was built against.",
					tradeoff:
						"Spending the first stretch on identity instead of features looks slow. It paid off the moment the UI decisions almost made themselves.",
					image: {
						src: "/images/projects/scopeguard/scopeguard-brand.png",
						alt: "ScopeGuard style guide: full logo, icon, color palette, and type",
					},
				},
			],
		},
		{
			id: "system",
			label: "The system",
			type: "features",
			display: "trio",
			intro:
				"Generating the contract is the hook. Keeping a business organized around those contracts is what makes it stick.",
			items: [
				{
					title: "Update",
					body: "Generated contracts aren't locked. Fix a number, add a line, resend. The document stays yours after it's written.",
					media: {
						src: "/images/projects/scopeguard/scopeguard-edit.png",
						alt: "Editing a generated contract in ScopeGuard",
						orientation: "portrait",
					},
				},
				{
					title: "Manage",
					body: "Every contract you've generated lives in one place. Search it, reopen it, and track what's been sent and signed.",
					media: {
						src: "/images/projects/scopeguard/scopeguard-manage.png",
						alt: "ScopeGuard document management view",
						orientation: "portrait",
					},
				},
				{
					title: "Organize",
					body: "Built for businesses, not just solo operators. Organize crews and companies so the right people see the right jobs.",
					media: {
						src: "/images/projects/scopeguard/scopeguard-organize.png",
						alt: "ScopeGuard organization and teams view",
						orientation: "portrait",
					},
				},
			],
		},
		{
			id: "outcome",
			label: "Outcome",
			type: "outcome",
			metrics: [
				{
					value: "750ms",
					label: "Spoken note to finished contract",
				},
				{
					value: "Editable",
					label: "Every contract stays easy to update",
				},
				{
					value: "One place",
					label: "Documents tracked, businesses organized",
				},
			],
			quote: {
				text: "This is exactly what my business needs. One contract this generates would cover the monthly price.",
				attribution: "Local general contractor, early feedback",
			},
			shipped: "Working prototype · self initiated · 2026",
		},
	],
} as const satisfies CaseStudy;
