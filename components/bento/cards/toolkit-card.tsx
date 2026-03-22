import { BentoCard } from "@/components/bento/bento-card";
import {
	BENTO_LABEL_CLASS,
	BENTO_SECTION_CLASS,
} from "@/components/bento/cards/styles";
import { ToolkitItem } from "@/components/bento/cards/toolkit-item";
import { homeContent } from "@/content/home";

type ToolkitCardProps = {
	className?: string;
	delay?: number;
};

export function ToolkitCard({ className, delay = 0.06 }: ToolkitCardProps) {
	const { toolkit } = homeContent;
	return (
		<BentoCard className={className} delay={delay}>
			<section className={BENTO_SECTION_CLASS}>
				<p className={BENTO_LABEL_CLASS}>{toolkit.label}</p>
				<div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
					{toolkit.items.map((item) => (
						<ToolkitItem key={item.id} item={item} />
					))}
				</div>
			</section>
		</BentoCard>
	);
}
