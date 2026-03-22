import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { type ReactNode, Suspense } from "react";
import { Dock } from "@/components/dock/dock";
import { CommandMenuProvider } from "@/components/layout/command-menu";
import { PageTransitionShell } from "@/components/layout/page-transition-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/content/home";
import { SITE_CONTAINER_MAX_WIDTH_CLASS } from "@/lib/layout-constants";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
});

const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.robbiejpatterson.com";
const socialImagePath = "/images/Opengraph.png";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: site.title,
		template: `%s | ${site.name}`,
	},
	description: site.description,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		url: "/",
		siteName: site.name,
		title: site.title,
		description: site.description,
		images: [
			{
				url: socialImagePath,
				width: 1200,
				height: 630,
				alt: `${site.name} social preview`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: site.title,
		description: site.description,
		images: [socialImagePath],
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col bg-[#0a0a0a] text-neutral-100">
				<CommandMenuProvider>
					<TooltipProvider delayDuration={80} skipDelayDuration={120}>
						<div
							className={`mx-auto flex w-full ${SITE_CONTAINER_MAX_WIDTH_CLASS} flex-1 flex-col px-6 pb-12 pt-6 sm:px-12 sm:pt-8`}
						>
							<div className="sticky top-0 z-30 pb-6 pt-2">
								<SiteHeader />
							</div>
							<Suspense fallback={children}>
								<PageTransitionShell>{children}</PageTransitionShell>
							</Suspense>
						</div>
						<Dock />
						<Analytics />
					</TooltipProvider>
				</CommandMenuProvider>
			</body>
		</html>
	);
}
