import { createClient } from "@supabase/supabase-js";
import {
	getSupabasePublishableKey,
	getSupabaseServiceKey,
	getSupabaseUrl,
} from "@/lib/supabase/env";

const serverAuthConfig = {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
};

export function createSupabasePublicServerClient() {
	return createClient(
		getSupabaseUrl(),
		getSupabasePublishableKey(),
		serverAuthConfig,
	);
}

export function createSupabaseServiceServerClient() {
	return createClient(
		getSupabaseUrl(),
		getSupabaseServiceKey(),
		serverAuthConfig,
	);
}
