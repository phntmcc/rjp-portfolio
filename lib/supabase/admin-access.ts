import {
	getServerAdminEmailAllowlist,
	isEmailInAllowlist,
} from "@/lib/supabase/env";

export function getAdminEmailAllowlist() {
	return getServerAdminEmailAllowlist();
}

export function isAdminEmailAllowed(email: string | null | undefined) {
	return isEmailInAllowlist(email, getAdminEmailAllowlist());
}
