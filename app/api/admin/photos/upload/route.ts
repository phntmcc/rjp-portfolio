import { randomUUID } from "node:crypto";
import exifr from "exifr";
import { NextResponse } from "next/server";
import { MAX_UPLOAD_BYTES } from "@/lib/photography-constants";
import {
	renderAvifLadder,
	renderBlurDataUrl,
	renderDisplayJpeg,
	renderThumbJpeg,
	uploadAvifLadder,
	uploadPhotoObject,
} from "@/lib/photography-variants";
import { isAdminEmailAllowed } from "@/lib/supabase/admin-access";
import {
	createSupabasePublicServerClient,
	createSupabaseServiceServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
// Six AVIF encodes off a 2400px source run well past the default timeout.
export const maxDuration = 300;

const ACCEPTED_FILE_TYPES = new Set(["image/jpeg", "image/jpg"]);

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function parseNumber(value: string | null) {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function formatAperture(value: unknown) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	const rounded = Number(value.toFixed(1));
	return Number.isInteger(rounded) ? `f/${rounded}` : `f/${rounded.toFixed(1)}`;
}

function formatFocalLength(value: unknown) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	return `${Math.round(value)}mm`;
}

function formatIso(value: unknown) {
	if (typeof value === "number" && Number.isFinite(value)) {
		return `${Math.round(value)}`;
	}
	return null;
}

function formatShutterSpeed(value: unknown) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
		return null;
	}

	if (value >= 1) {
		const rounded = Number(value.toFixed(1));
		return `${rounded}s`;
	}

	const denominator = Math.round(1 / value);
	if (denominator <= 0) return null;
	return `1/${denominator}`;
}

function parseShotAt(shotAtRaw: string | null, exifDate: unknown) {
	if (shotAtRaw) {
		const explicit = new Date(shotAtRaw);
		if (!Number.isNaN(explicit.valueOf())) {
			return explicit.toISOString();
		}
	}

	if (exifDate instanceof Date && !Number.isNaN(exifDate.valueOf())) {
		return exifDate.toISOString();
	}

	return null;
}

function ensureBearerToken(authHeader: string | null) {
	if (!authHeader?.startsWith("Bearer ")) return null;
	const token = authHeader.slice("Bearer ".length).trim();
	return token.length > 0 ? token : null;
}

export async function POST(request: Request) {
	try {
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

		const formData = await request.formData();
		const file = formData.get("file");
		if (!(file instanceof File)) {
			return NextResponse.json(
				{ error: "A JPEG file is required" },
				{ status: 400 },
			);
		}

		if (!ACCEPTED_FILE_TYPES.has(file.type)) {
			return NextResponse.json(
				{ error: "Only JPEG images are supported" },
				{ status: 400 },
			);
		}

		if (file.size > MAX_UPLOAD_BYTES) {
			return NextResponse.json(
				{ error: "File exceeds 50 MB upload limit" },
				{ status: 400 },
			);
		}

		const locationName = `${formData.get("locationName") ?? ""}`.trim();
		const locationSlugInput = `${formData.get("locationSlug") ?? ""}`.trim();

		if (!locationName) {
			return NextResponse.json(
				{ error: "Location name is required" },
				{ status: 400 },
			);
		}

		const locationSlug = slugify(locationSlugInput || locationName);
		if (!locationSlug) {
			return NextResponse.json(
				{ error: "Unable to generate location slug" },
				{ status: 400 },
			);
		}

		const sourceBuffer = Buffer.from(await file.arrayBuffer());
		const exifData = await exifr.parse(sourceBuffer);

		const displayResult = await renderDisplayJpeg(sourceBuffer);
		const thumbBuffer = await renderThumbJpeg(displayResult.data);
		const blurDataUrl = await renderBlurDataUrl(displayResult.data);
		const avifVariants = await renderAvifLadder(
			sourceBuffer,
			displayResult.info.width,
			displayResult.info.height,
		);

		const photoId = randomUUID();
		const displayPath = `display/${photoId}.jpg`;
		const thumbPath = `thumb/${photoId}.jpg`;

		const serviceClient = createSupabaseServiceServerClient();
		const displayUrl = await uploadPhotoObject({
			client: serviceClient,
			path: displayPath,
			body: displayResult.data,
			contentType: "image/jpeg",
		});
		const thumbUrl = await uploadPhotoObject({
			client: serviceClient,
			path: thumbPath,
			body: thumbBuffer,
			contentType: "image/jpeg",
		});
		const variants = await uploadAvifLadder({
			client: serviceClient,
			photoId,
			variants: avifVariants,
		});

		const exifRecord = exifData ?? {};
		const shotAt = parseShotAt(null, exifRecord.DateTimeOriginal);

		const { error: insertError } = await serviceClient.from("photos").insert({
			id: photoId,
			title: null,
			description: null,
			shot_at: shotAt,
			location_name: locationName,
			location_slug: locationSlug,
			lat: parseNumber(
				typeof exifRecord.latitude === "number"
					? String(exifRecord.latitude)
					: null,
			),
			lng: parseNumber(
				typeof exifRecord.longitude === "number"
					? String(exifRecord.longitude)
					: null,
			),
			camera_make:
				typeof exifRecord.Make === "string" ? exifRecord.Make.trim() : null,
			camera_model:
				typeof exifRecord.Model === "string" ? exifRecord.Model.trim() : null,
			lens:
				typeof exifRecord.LensModel === "string"
					? exifRecord.LensModel.trim()
					: null,
			iso: formatIso(exifRecord.ISO),
			aperture: formatAperture(exifRecord.FNumber),
			shutter_speed: formatShutterSpeed(exifRecord.ExposureTime),
			focal_length: formatFocalLength(exifRecord.FocalLength),
			width: displayResult.info.width ?? null,
			height: displayResult.info.height ?? null,
			orientation:
				typeof exifRecord.Orientation === "number"
					? exifRecord.Orientation
					: null,
			blur_data_url: blurDataUrl,
			image_path: displayPath,
			thumb_path: thumbPath,
			display_url: displayUrl,
			thumb_url: thumbUrl,
			variants,
		});

		if (insertError) {
			throw new Error(insertError.message);
		}

		return NextResponse.json({
			ok: true,
			id: photoId,
			displayUrl,
			thumbUrl,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Upload failed" },
			{ status: 500 },
		);
	}
}
