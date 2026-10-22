import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "phntm OS Privacy",
	description: "Privacy policy for phntm OS, a personal Android TV home screen.",
	alternates: {
		canonical: "/phntm/privacy",
	},
};

export default function PhntmPrivacyPage() {
	return (
		<main className="mx-auto max-w-xl px-6 py-24 text-sm leading-relaxed">
			<h1 className="mb-1 text-2xl font-semibold">phntm OS Privacy</h1>
			<p className="mb-8 opacity-60">Updated October 2026</p>

			<p className="mb-4">
				phntm OS is a personal home screen for my own Android TV. If you
				connect a YouTube account, phntm asks for read-only access
				(youtube.readonly) to list the channels you subscribe to, so it can
				show their latest videos.
			</p>
			<p className="mb-4">
				That data stays on the TV. It is not sent to any server, shared, sold,
				or used for ads, and phntm has no analytics.
			</p>
			<p className="mb-4">
				You can remove access at any time at{" "}
				<a className="underline" href="https://myaccount.google.com/permissions">
					myaccount.google.com/permissions
				</a>
				, or by choosing Disconnect in phntm.
			</p>
			<p className="opacity-60">
				phntm&apos;s use of information received from Google APIs adheres to
				the Google API Services User Data Policy, including the Limited Use
				requirements.
			</p>
		</main>
	);
}