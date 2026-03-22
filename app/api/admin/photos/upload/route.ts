import { randomUUID } from "node:crypto";
import exifr from "exifr";
import { NextResponse } from "next/server";
import sharp from "sharp";
import {
	DISPLAY_MAX_PX,
	MAX_UPLOAD_BYTES,
	THUMB_MAX_PX,
} from "@/lib/photography-constants";
import { isAdminEmailAllowed } from "@/lib/supabase/admin-access";
import { getPhotosBucketName } from "@/lib/supabase/env";
import {
	createSupabasePublicServerClient,
	createSupabaseServiceServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

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

		const displayResult = await sharp(sourceBuffer)
			.rotate()
			.resize(DISPLAY_MAX_PX, DISPLAY_MAX_PX, {
				fit: "inside",
				withoutEnlargement: true,
			})
			.jpeg({ quality: 82, mozjpeg: true })
			.toBuffer({ resolveWithObject: true });

		const thumbBuffer = await sharp(displayResult.data)
			.resize(THUMB_MAX_PX, THUMB_MAX_PX, {
				fit: "inside",
				withoutEnlargement: true,
			})
			.jpeg({ quality: 74, mozjpeg: true })
			.toBuffer();

		const blurBuffer = await sharp(displayResult.data)
			.resize(24, 24, {
				fit: "inside",
				withoutEnlargement: false,
			})
			.jpeg({ quality: 40, mozjpeg: true })
			.toBuffer();

		const blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
		const photoId = randomUUID();
		const bucket = getPhotosBucketName();
		const displayPath = `display/${photoId}.jpg`;
		const thumbPath = `thumb/${photoId}.jpg`;

		const serviceClient = createSupabaseServiceServerClient();
		const displayUpload = await serviceClient.storage
			.from(bucket)
			.upload(displayPath, displayResult.data, {
				contentType: "image/jpeg",
				upsert: false,
			});
		if (displayUpload.error) {
			throw new Error(displayUpload.error.message);
		}

		const thumbUpload = await serviceClient.storage
			.from(bucket)
			.upload(thumbPath, thumbBuffer, {
				contentType: "image/jpeg",
				upsert: false,
			});
		if (thumbUpload.error) {
			throw new Error(thumbUpload.error.message);
		}

		const { data: displayPublic } = serviceClient.storage
			.from(bucket)
			.getPublicUrl(displayPath);
		const { data: thumbPublic } = serviceClient.storage
			.from(bucket)
			.getPublicUrl(thumbPath);

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
			display_url: displayPublic.publicUrl,
			thumb_url: thumbPublic.publicUrl,
		});

		if (insertError) {
			throw new Error(insertError.message);
		}

		return NextResponse.json({
			ok: true,
			id: photoId,
			displayUrl: displayPublic.publicUrl,
			thumbUrl: thumbPublic.publicUrl,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Upload failed" },
			{ status: 500 },
		);
	}
}
