import { NextResponse } from "next/server";
import { isAdminEmailAllowed } from "@/lib/supabase/admin-access";
import { createSupabasePublicServerClient } from "@/lib/supabase/server";

function ensureBearerToken(authHeader: string | null) {
	if (!authHeader?.startsWith("Bearer ")) return null;
	const token = authHeader.slice("Bearer ".length).trim();
	return token.length > 0 ? token : null;
}

export async function GET(request: Request) {
	const bearerToken = ensureBearerToken(request.headers.get("authorization"));
	if (!bearerToken) {
		return NextResponse.json(
			{ error: "Missing bearer token" },
			{ status: 401 },
		);
	}

	const publicClient = createSupabasePublicServerClient();
	const {
		data: { user },
		error: userError,
	} = await publicClient.auth.getUser(bearerToken);

	if (userError || !user || !isAdminEmailAllowed(user.email)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data, error } = await publicClient
		.from("photos")
		.select("location_name,location_slug")
		.order("location_name", { ascending: true });

	if (error || !data) {
		return NextResponse.json({ locations: [] as never[] });
	}

	const deduped = new Map<string, { name: string; slug: string }>();
	for (const item of data) {
		if (!item.location_name || !item.location_slug) continue;
		if (!deduped.has(item.location_slug)) {
			deduped.set(item.location_slug, {
				name: item.location_name,
				slug: item.location_slug,
			});
		}
	}

	return NextResponse.json({
		locations: [...deduped.values()],
	});
}
