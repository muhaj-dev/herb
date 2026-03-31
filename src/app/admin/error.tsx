"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="p-3 bg-red-500/10 rounded-full inline-flex mb-4">
          <span className="material-symbols-outlined text-4xl text-red-400">
            error
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-400 mb-6 text-sm">
          An unexpected error occurred. Please try again or return to the
          dashboard.
        </p>
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
