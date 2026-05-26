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
  /** Hide preview if the caller wants to render its own. */
  hidePreview?: boolean;
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
  hidePreview = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [dragOver, setDragOver] = useState(false);

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

    const fd = new FormData();
    fd.append("file", file);

    startUpload(async () => {
      const result = await uploadMedia(fd, accept);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onChange(result.url);
    });
  };

  const isVideoValue = !!value && (accept === "video" || looksLikeVideo(value));

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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
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
            disabled={uploading}
            className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed transition-colors text-sm ${
              dragOver
                ? "border-[#13ec37] bg-[#13ec37]/10 text-white"
                : "border-[#234829] bg-[#112214] text-slate-400 hover:border-[#13ec37]/60 hover:text-white"
            } disabled:opacity-50 disabled:cursor-wait`}
          >
            <span className="material-symbols-outlined text-3xl text-[#13ec37]">
              {uploading
                ? "hourglass_empty"
                : accept === "video"
                ? "video_file"
                : accept === "any"
                ? "perm_media"
                : "add_photo_alternate"}
            </span>
            <span className="font-medium">
              {uploading
                ? "Uploading…"
                : uploadLabel ??
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
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://example.com/file.jpg"}
          className={inputCls}
        />
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {value && (
        <div className="flex items-center gap-2 text-xs text-slate-400 break-all">
          <span className="material-symbols-outlined text-[16px] text-[#13ec37]">
            check_circle
          </span>
          <span className="truncate flex-1" title={value}>
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Remove"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {!hidePreview && (
        <div className="aspect-video w-full rounded-lg bg-[#112214] border border-[#234829] overflow-hidden flex items-center justify-center">
          {value ? (
            isVideoValue ? (
              <video
                src={value}
                controls
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLVideoElement).style.display = "none";
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-600">
              <span className="material-symbols-outlined text-3xl">
                {accept === "video" ? "movie" : "image"}
              </span>
              <span className="text-xs">No {accept === "video" ? "video" : "media"} yet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
