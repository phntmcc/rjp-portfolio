function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

function getRequiredPublicEnv(
	value: string | undefined,
	name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
): string {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

function normalizeEmail(value: string) {
	return value.trim().toLowerCase();
}

function parseAdminEmailList(rawValue: string) {
	return rawValue
		.split(",")
		.map((item) => normalizeEmail(item))
		.filter(Boolean);
}

export function getSupabaseUrl() {
	// Use direct env access so Turbopack can inline NEXT_PUBLIC_* in client code.
	return getRequiredPublicEnv(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		"NEXT_PUBLIC_SUPABASE_URL",
	);
}

export function getSupabasePublishableKey() {
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (anonKey) return anonKey;

	const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
	if (publishableKey) return publishableKey;

	throw new Error(
		"Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
	);
}

export function getSupabaseServiceKey() {
	return (
		process.env.SUPABASE_SERVICE_ROLE_KEY ??
		process.env.SUPABASE_SECRET_KEY ??
		getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
	);
}

export function getPhotosBucketName() {
	return process.env.SUPABASE_PHOTOS_BUCKET ?? "photos";
}

export function getServerAdminEmailAllowlist() {
	const fromList = parseAdminEmailList(process.env.SUPABASE_ADMIN_EMAILS ?? "");
	if (fromList.length > 0) return fromList;
	const single = normalizeEmail(process.env.SUPABASE_ADMIN_EMAIL ?? "");
	return single ? [single] : [];
}

export function getClientAdminEmailAllowlist() {
	const fromList = parseAdminEmailList(
		process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS ?? "",
	);
	if (fromList.length > 0) return fromList;
	const single = normalizeEmail(
		process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAIL ?? "",
	);
	return single ? [single] : [];
}

export function isEmailInAllowlist(
	email: string | null | undefined,
	allowlist: readonly string[],
) {
	if (!email || allowlist.length === 0) return false;
	return allowlist.includes(normalizeEmail(email));
}
