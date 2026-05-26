"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/actions/auth-actions";

const BUCKET = "media";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

// 10 MB for images, 100 MB for video. Storage bucket has the same hard cap.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export type UploadResult =
  | { url: string; path: string; kind: "image" | "video" }
  | { error: string };

/**
 * Upload a file from the browser to Supabase Storage and return its public URL.
 *
 * `accept` lets the caller restrict to images or videos (or allow both);
 * the function still re-validates mime + size server-side because client
 * `accept` attributes are advisory only.
 */
export async function uploadMedia(
  formData: FormData,
  accept: "image" | "video" | "any" = "any"
): Promise<UploadResult> {
  // Auth gate — uploading is admin-only. RLS would block this anyway, but
  // failing fast gives a friendlier error.
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Not authorised to upload." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }

  const type = file.type;
  const isImage = ALLOWED_IMAGE_TYPES.has(type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(type);

  if (!isImage && !isVideo) {
    return {
      error:
        "Unsupported file type. Use JPG/PNG/WEBP/GIF/AVIF or MP4/WEBM/MOV.",
    };
  }
  if (accept === "image" && !isImage) {
    return { error: "Only image files are allowed here." };
  }
  if (accept === "video" && !isVideo) {
    return { error: "Only video files are allowed here." };
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    const limitMb = Math.round(maxBytes / (1024 * 1024));
    return { error: `File is too large. Limit is ${limitMb} MB.` };
  }

  const kind: "image" | "video" = isImage ? "image" : "video";
  const ext = guessExtension(file.name, type);
  const safeId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  // Group by kind + first byte of uuid so folders stay shallow.
  const path = `${kind}s/${safeId.slice(0, 2)}/${safeId}${ext}`;

  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: type,
      cacheControl: "31536000", // 1 year — paths are uuid-keyed so safe to cache hard
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadMedia] storage upload failed:", uploadError);
    return { error: uploadError.message ?? "Upload failed." };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    return { error: "Upload succeeded but URL could not be resolved." };
  }

  return { url: data.publicUrl, path, kind };
}

function guessExtension(name: string, mime: string): string {
  // Prefer the original extension when it's something sane; otherwise derive
  // from the mime type so the stored object has a useful suffix.
  const fromName = name.includes(".")
    ? "." + name.split(".").pop()!.toLowerCase().slice(0, 5)
    : "";
  if (/^\.[a-z0-9]{2,5}$/.test(fromName)) return fromName;

  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/avif":
      return ".avif";
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    default:
      return "";
  }
}
