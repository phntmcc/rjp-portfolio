"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
	return createClient(getSupabaseUrl(), getSupabasePublishableKey());
}
