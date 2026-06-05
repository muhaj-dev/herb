"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { uploadMedia } from "@/lib/actions/upload-actions";

type Accept = "image" | "video" | "any";

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Restrict file picker + server validation. Defaults to "image". */
  accept?: Accept;
  /** Placeholder for the URL field. */
  placeholder?: string;
  /** Label override for the upload affordance. */
  uploadLabel?: string;
};

const tabBase =
  "flex-1 text-xs font-medium px-3 py-2 rounded-md transition-colors";
const inputCls =
  "w-full bg-[#162b1b] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#13ec37]/50 focus:border-[#13ec37] focus:outline-none transition-all text-sm";

function looksLikeVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
}

export default function MediaUpload({
  value,
  onChange,
  accept = "image",
  placeholder,
  uploadLabel,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  // Local object-URL preview shown the instant a file is picked, so the user
  // sees the image/video immediately instead of waiting for the upload.
  const [localPreview, setLocalPreview] = useState<{
    url: string;
    isVideo: boolean;
  } | null>(null);

  // Revoke any outstanding object URL when it changes or on unmount to avoid
  // leaking blob references.
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview.url);
    };
  }, [localPreview]);

  // If a URL is already set when we mount, default the tab to "url" so the
  // user sees the existing value rather than an empty uploader.
  useEffect(() => {
    if (value && !uploading) setMode((m) => (m === "upload" ? "url" : m));
    // We deliberately only run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptAttr =
    accept === "image"
      ? "image/*"
      : accept === "video"
      ? "video/*"
      : "image/*,video/*";

  const handleFiles = (files: FileList | null) => {
    setError(null);
    const file = files?.[0];
    if (!file) return;

    // Show an instant local preview before the (potentially slow) upload.
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") };
    });

    const fd = new FormData();
    fd.append("file", file);

    startUpload(async () => {
      const result = await uploadMedia(fd, accept);
      if ("error" in result) {
        setError(result.error);
        // Drop the local preview so a failed upload doesn't look successful.
        setLocalPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return null;
        });
        return;
      }
      onChange(result.url);
      // The uploaded URL now drives the preview; release the local blob.
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return null;
      });
    });
  };

  // The remote `value` takes precedence once uploaded; otherwise fall back to
  // the local object-URL preview while an upload is in flight.
  const previewUrl = value || localPreview?.url || "";
  const isVideoValue = value
    ? accept === "video" || looksLikeVideo(value)
    : !!localPreview?.isVideo;

  return (
    <div className="flex flex-col gap-3">
      {/* Mode tabs */}
      <div className="inline-flex p-1 rounded-lg bg-[#112214] border border-[#234829] gap-1">
        <button
          type="button"
          onClick={() => {
            setMode("upload");
            setError(null);
          }}
          className={`${tabBase} ${
            mode === "upload"
              ? "bg-[#13ec37] text-[#102213]"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] align-middle mr-1">
            upload
          </span>
          Upload
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("url");
            setError(null);
          }}
          className={`${tabBase} ${
            mode === "url"
              ? "bg-[#13ec37] text-[#102213]"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] align-middle mr-1">
            link
          </span>
          URL
        </button>
      </div>

      {mode === "upload" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptAttr}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {/* The dropzone doubles as the preview surface: once a file is picked
              the image/video fills this box instead of showing in a box below. */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
              dragOver
                ? "border-[#13ec37] bg-[#13ec37]/10"
                : previewUrl
                ? "border-[#234829] bg-black"
                : "border-[#234829] bg-[#112214] hover:border-[#13ec37]/60"
            }`}
          >
            {previewUrl ? (
              <>
                {isVideoValue ? (
                  <video
                    src={previewUrl}
                    controls
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                )}
                {/* Corner actions — change / remove, kept out of the way so
                    they don't cover video controls. */}
                {!uploading && (
                  <div className="absolute right-2 top-2 z-10 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Replace"
                      className="flex size-8 items-center justify-center rounded-md border border-[#234829] bg-[#102213]/80 text-white backdrop-blur transition-colors hover:text-[#13ec37]"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        swap_horiz
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChange("");
                        setLocalPreview((prev) => {
                          if (prev) URL.revokeObjectURL(prev.url);
                          return null;
                        });
                      }}
                      title="Remove"
                      className="flex size-8 items-center justify-center rounded-md border border-[#234829] bg-[#102213]/80 text-white backdrop-blur transition-colors hover:text-red-400"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-sm text-slate-400 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-3xl text-[#13ec37]">
                  {accept === "video"
                    ? "video_file"
                    : accept === "any"
                    ? "perm_media"
                    : "add_photo_alternate"}
                </span>
                <span className="font-medium">
                  {uploadLabel ??
                    (accept === "video"
                      ? "Click or drop a video here"
                      : accept === "any"
                      ? "Click or drop an image / video here"
                      : "Click or drop an image here")}
                </span>
                <span className="text-xs text-slate-500">
                  {accept === "video"
                    ? "MP4, WEBM, MOV · up to 100 MB"
                    : accept === "any"
                    ? "Image up to 10 MB · video up to 100 MB"
                    : "JPG, PNG, WEBP, GIF, AVIF · up to 10 MB"}
                </span>
              </button>
            )}

            {uploading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 bg-[#102213]/70 text-white backdrop-blur-sm">
                <span className="material-symbols-outlined animate-spin text-3xl text-[#13ec37]">
                  progress_activity
                </span>
                <span className="text-xs font-medium">Uploading…</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "https://example.com/file.jpg"}
            className={inputCls}
          />
          {/* URL mode has no dropzone, so preview the entered URL here. */}
          {previewUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#234829] bg-black">
              {isVideoValue ? (
                <video
                  src={previewUrl}
                  controls
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLVideoElement).style.display = "none";
                  }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => onChange("")}
                title="Remove"
                className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-md border border-[#234829] bg-[#102213]/80 text-white backdrop-blur transition-colors hover:text-red-400"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
