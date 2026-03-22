"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import {
	isPlainLeftClick,
	navigateWithTransition,
} from "@/components/navigation/transition-routing";

type TransitionLinkProps = ComponentProps<typeof Link>;

export function TransitionLink({
	href,
	onClick,
	target,
	...props
}: TransitionLinkProps) {
	const router = useRouter();
	const dataNoTransition = (props as Record<string, unknown>)[
		"data-no-transition"
	];
	const disableTransition =
		dataNoTransition === true || dataNoTransition === "true";

	return (
		<Link
			href={href}
			target={target}
			{...props}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				if (disableTransition) return;
				if (target === "_blank") return;
				if (!isPlainLeftClick(event)) return;
				if (typeof href !== "string") return;
				if (!href.startsWith("/")) return;

				event.preventDefault();
				navigateWithTransition(router, href);
			}}
		/>
	);
}
