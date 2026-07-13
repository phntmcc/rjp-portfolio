import { BodyPortal } from "@/components/case-study/body-portal";

export function AmbientBackground() {
	return (
		<BodyPortal>
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
			>
				<div className="ambient-blob-a absolute -left-[14vw] -top-[18vw] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_6%,transparent),transparent_70%)] blur-[60px]" />
				<div className="ambient-blob-b absolute -bottom-[14vw] -right-[12vw] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_70%)] blur-[60px]" />
			</div>
		</BodyPortal>
	);
}
