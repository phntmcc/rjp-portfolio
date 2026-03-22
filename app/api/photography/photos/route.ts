import { NextResponse } from "next/server";
import { getPhotographyPhotosPage } from "@/lib/photography";
import {
	PHOTOGRAPHY_MAX_PAGE_SIZE,
	PHOTOGRAPHY_PAGE_SIZE,
} from "@/lib/photography-constants";

function parseNumberParam(value: string | null, fallback: number) {
	if (!value) return fallback;
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return fallback;
	return Math.floor(parsed);
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const location = searchParams.get("location")?.trim() || undefined;
	const offset = Math.max(0, parseNumberParam(searchParams.get("offset"), 0));
	const limit = Math.max(
		1,
		Math.min(
			PHOTOGRAPHY_MAX_PAGE_SIZE,
			parseNumberParam(searchParams.get("limit"), PHOTOGRAPHY_PAGE_SIZE),
		),
	);

	const page = await getPhotographyPhotosPage({
		locationSlug: location,
		offset,
		limit,
	});

	return NextResponse.json(page);
}
