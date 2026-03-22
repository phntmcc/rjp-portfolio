"use client";

import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DISPLAY_MAX_PX } from "@/lib/photography-constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
	getClientAdminEmailAllowlist,
	isEmailInAllowlist,
} from "@/lib/supabase/env";

type UploadResult = {
	fileName: string;
	ok: boolean;
	message: string;
};

type ExistingLocation = {
	name: string;
	slug: string;
};

const adminEmails = getClientAdminEmailAllowlist();

function isClientEmailAllowed(email: string | undefined) {
	return isEmailInAllowlist(email, adminEmails);
}

export default function AdminPhotosPage() {
	const supabase = useMemo(() => createSupabaseBrowserClient(), []);
	const [session, setSession] = useState<Session | null>(null);
	const [loadingSession, setLoadingSession] = useState(true);
	const [email, setEmail] = useState("");
	const [emailSent, setEmailSent] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	const [files, setFiles] = useState<File[]>([]);
	const [existingLocations, setExistingLocations] = useState<
		ExistingLocation[]
	>([]);
	const [selectedLocationSlug, setSelectedLocationSlug] = useState("");
	const [locationName, setLocationName] = useState("");
	const [locationSlug, setLocationSlug] = useState("");
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [results, setResults] = useState<UploadResult[]>([]);

	useEffect(() => {
		void supabase.auth
			.getSession()
			.then(({ data }) => setSession(data.session))
			.finally(() => setLoadingSession(false));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	useEffect(() => {
		if (!session?.access_token || !isClientEmailAllowed(session.user.email))
			return;

		void fetch("/api/admin/photos/locations", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		})
			.then(async (response) => {
				if (!response.ok) return null;
				return (await response.json()) as { locations?: ExistingLocation[] };
			})
			.then((payload) => setExistingLocations(payload?.locations ?? []))
			.catch(() => setExistingLocations([]));
	}, [session]);

	const selectedFilesLabel = useMemo(() => {
		if (files.length === 0) return "No files selected";
		if (files.length === 1) return files[0].name;
		return `${files.length} files selected`;
	}, [files]);

	const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAuthError(null);
		setEmailSent(false);
		const normalizedEmail = email.trim().toLowerCase();

		if (!isClientEmailAllowed(normalizedEmail)) {
			setAuthError("This email is not allowed for admin access.");
			return;
		}

		const redirectTo =
			typeof window !== "undefined"
				? `${window.location.origin}/admin/photos`
				: undefined;

		const { error } = await supabase.auth.signInWithOtp({
			email: normalizedEmail,
			options: { emailRedirectTo: redirectTo },
		});

		if (error) {
			setAuthError(error.message);
			return;
		}

		setEmailSent(true);
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setSession(null);
	};

	const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!session?.access_token || files.length === 0 || !locationName.trim()) {
			return;
		}

		setUploading(true);
		setUploadProgress(0);
		setResults([]);

		const nextResults: UploadResult[] = [];

		for (let index = 0; index < files.length; index += 1) {
			const file = files[index];
			const formData = new FormData();
			formData.set("file", file);
			formData.set("locationName", locationName.trim());
			if (locationSlug.trim())
				formData.set("locationSlug", locationSlug.trim());

			const response = await fetch("/api/admin/photos/upload", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
				body: formData,
			});

			if (!response.ok) {
				const errorPayload = (await response.json().catch(() => null)) as {
					error?: string;
				} | null;
				nextResults.push({
					fileName: file.name,
					ok: false,
					message: errorPayload?.error ?? "Upload failed",
				});
			} else {
				nextResults.push({
					fileName: file.name,
					ok: true,
					message: "Uploaded successfully",
				});
			}

			setUploadProgress(Math.round(((index + 1) / files.length) * 100));
			setResults([...nextResults]);
		}

		setUploading(false);
	};

	const userEmail = session?.user.email ?? "";
	const isAuthorizedSession = isClientEmailAllowed(userEmail);

	if (loadingSession) {
		return (
			<main className="flex min-h-[50vh] items-center justify-center">
				<Loader2 className="size-6 animate-spin text-neutral-400" />
			</main>
		);
	}

	if (!session) {
		return (
			<main className="mx-auto w-full max-w-xl space-y-5 pb-24">
				<PageHeader
					title="Photo Upload Admin"
					description="Sign in with your admin email to upload and tag photography assets."
					className="mb-0"
				/>
				<form
					onSubmit={handleMagicLink}
					className="space-y-4 rounded-2xl border border-white/10 bg-white/3 p-5"
				>
					<div className="space-y-1.5">
						<label className="text-sm text-neutral-300" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/35"
							placeholder="you@example.com"
						/>
						{adminEmails.length > 0 ? (
							<p className="text-xs text-neutral-500">
								Allowed: {adminEmails.join(", ")}
							</p>
						) : null}
					</div>
					<button
						type="submit"
						className="rounded-lg border border-white/15 bg-white/8 px-4 py-2 text-sm text-white transition hover:bg-white/12"
					>
						Send magic link
					</button>
					{emailSent ? (
						<p className="text-sm text-emerald-300">
							Magic link sent. Check your inbox.
						</p>
					) : null}
					{authError ? (
						<p className="text-sm text-red-300">{authError}</p>
					) : null}
				</form>
			</main>
		);
	}

	if (!isAuthorizedSession) {
		return (
			<main className="mx-auto w-full max-w-xl space-y-4 pb-24">
				<PageHeader
					title="Photo Upload Admin"
					description="Sign out and use your approved admin email."
					className="mb-0"
					actions={
						<p className="text-base text-red-300">
							This account is signed in but not allowed to upload photos.
						</p>
					}
				/>
				<button
					type="button"
					onClick={handleSignOut}
					className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
				>
					<LogOut className="size-4" />
					Sign out
				</button>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-3xl space-y-5 pb-24">
			<section className="animate-resume-in flex flex-wrap items-start justify-between gap-3">
				<PageHeader
					title="Photo Upload Admin"
					description={`Upload optimized JPEGs (${DISPLAY_MAX_PX}px max), auto-extract EXIF metadata, and apply one location/slug to the full batch.`}
					className="mb-0 max-w-2xl"
				/>
				<button
					type="button"
					onClick={handleSignOut}
					className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
				>
					<LogOut className="size-4" />
					Sign out
				</button>
			</section>

			<form
				onSubmit={handleUpload}
				className="space-y-5 rounded-2xl border border-white/10 bg-white/3 p-5"
			>
				{existingLocations.length > 0 ? (
					<div className="space-y-1.5">
						<label
							className="text-sm text-neutral-300"
							htmlFor="existingLocation"
						>
							Use existing location (recommended)
						</label>
						<select
							id="existingLocation"
							value={selectedLocationSlug}
							onChange={(event) => {
								const slug = event.target.value;
								setSelectedLocationSlug(slug);
								const selected = existingLocations.find(
									(item) => item.slug === slug,
								);
								if (!selected) return;
								setLocationName(selected.name);
								setLocationSlug(selected.slug);
							}}
							className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/35"
						>
							<option value="">Select a previously used location</option>
							{existingLocations.map((location) => (
								<option key={location.slug} value={location.slug}>
									{location.name} ({location.slug})
								</option>
							))}
						</select>
					</div>
				) : null}

				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-sm text-neutral-300" htmlFor="locationName">
							Location name *
						</label>
						<input
							id="locationName"
							required
							value={locationName}
							onChange={(event) => setLocationName(event.target.value)}
							className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/35"
							placeholder="Toronto, ON"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm text-neutral-300" htmlFor="locationSlug">
							Location slug (optional, auto-generated if blank)
						</label>
						<input
							id="locationSlug"
							value={locationSlug}
							onChange={(event) => setLocationSlug(event.target.value)}
							className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/35"
							placeholder="toronto-on"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="files"
						className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-black/20 px-4 py-4 text-sm text-neutral-300 transition hover:border-white/35 hover:text-white"
					>
						<Upload className="size-4" />
						<span>Select JPEG files</span>
					</label>
					<input
						id="files"
						type="file"
						accept=".jpg,.jpeg,image/jpeg"
						multiple
						required
						onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
						className="hidden"
					/>
					<p className="text-xs text-neutral-400">{selectedFilesLabel}</p>
					<p className="text-xs text-neutral-500">
						Batch uploads apply the same location + slug to every selected file.
					</p>
				</div>

				<button
					type="submit"
					disabled={uploading || files.length === 0}
					className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{uploading ? <Loader2 className="size-4 animate-spin" /> : null}
					{uploading ? "Uploading..." : "Upload photos"}
				</button>

				{uploading ? (
					<p className="text-sm text-neutral-300">
						Progress: {uploadProgress}%
					</p>
				) : null}
			</form>

			{results.length > 0 ? (
				<section className="space-y-2 rounded-2xl border border-white/10 bg-white/3 p-5">
					<h2 className="font-serif text-2xl text-white">
						Latest upload results
					</h2>
					<ul className="space-y-1.5">
						{results.map((result) => (
							<li
								key={`${result.fileName}-${result.message}`}
								className={`text-sm ${result.ok ? "text-emerald-300" : "text-red-300"}`}
							>
								{result.fileName}: {result.message}
							</li>
						))}
					</ul>
				</section>
			) : null}
		</main>
	);
}
