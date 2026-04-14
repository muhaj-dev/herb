"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="p-3 bg-red-500/10 rounded-full inline-flex mb-4">
          <span className="material-symbols-outlined text-4xl text-red-400">
            error
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-400 mb-4 text-sm">
          An unexpected error occurred. Please try again or return to the
          dashboard.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <pre className="text-left bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-xs mb-6 overflow-auto max-h-64 whitespace-pre-wrap break-words">
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ""}
            {error.stack ? `\n\n${error.stack}` : ""}
          </pre>
        )}
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#102213] font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="px-5 py-2.5 bg-[#234829] hover:bg-[#234829]/80 text-white font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
