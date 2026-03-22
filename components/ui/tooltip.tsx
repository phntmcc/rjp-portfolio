"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
	className,
	children,
	side = "top",
	sideOffset = 6,
	ref,
	...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				ref={ref}
				side={side}
				sideOffset={sideOffset}
				className={`z-9999 max-w-[min(100vw-1rem,280px)] rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-[11px] leading-tight text-neutral-300 shadow-md outline-none ${className ?? ""}`}
				{...props}
			>
				{children}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}
