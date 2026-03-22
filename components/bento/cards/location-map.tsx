type LocationMapProps = {
	apiKey: string;
	lat: number;
	lng: number;
	zoom: number;
};

export function LocationMap({ apiKey, lat, lng, zoom }: LocationMapProps) {
	const src = `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(apiKey)}&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap`;

	return (
		<div className="absolute inset-0 overflow-hidden">
			<iframe
				title="Map view"
				src={src}
				className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(1.05)_brightness(0.78)_saturate(0.6)]"
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-black/20"
			/>
		</div>
	);
}
