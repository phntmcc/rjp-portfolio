import { BRAND_MARK_PATHS } from "@/lib/brand-mark";

export function MarkLogo({ className }: { className?: string }) {
	return (
		<svg
			className={`text-accent ${className ?? ""}`.trim()}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
		>
			<title>RP mark</title>
			<g clipPath="url(#clip0_60_3)">
				{BRAND_MARK_PATHS.map((d) => (
					<path key={d} d={d} fill="currentColor" />
				))}
			</g>
			<defs>
				<clipPath id="clip0_60_3">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
