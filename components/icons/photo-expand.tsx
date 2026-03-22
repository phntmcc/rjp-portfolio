export function PhotoExpandIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={16}
			height={16}
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
		>
			<title>Expand</title>
			<path
				d="M4.66666 4.66669H11.3333V11.3334"
				stroke="currentColor"
				strokeWidth="1.33333"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.66666 11.3334L11.3333 4.66669"
				stroke="currentColor"
				strokeWidth="1.33333"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
