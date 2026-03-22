import type { Metadata } from "next";
import { ResumeGrid } from "@/components/resume/resume-grid";
import { resumeContent } from "@/content/resume";

export const metadata: Metadata = {
	title: "Resume",
	description: resumeContent.header.summary,
	alternates: {
		canonical: "/resume",
	},
	openGraph: {
		title: "Resume | Robbie Patterson",
		description: resumeContent.header.summary,
		url: "/resume",
		images: [
			{
				url: "/images/Opengraph.png",
				width: 1200,
				height: 630,
				alt: "Robbie Patterson social preview",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Resume | Robbie Patterson",
		description: resumeContent.header.summary,
		images: ["/images/Opengraph.png"],
	},
};

export default function ResumePage() {
	return (
		<main className="resume-page">
			<ResumeGrid />
		</main>
	);
}
