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
	},
	twitter: {
		title: "Resume | Robbie Patterson",
		description: resumeContent.header.summary,
	},
};

export default function ResumePage() {
	return (
		<main className="resume-page">
			<ResumeGrid />
		</main>
	);
}
