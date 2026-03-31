"use client";

import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 bg-surface">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-primary/40 mb-4 block">
          error
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-text-main font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-on-surface/60 mb-8">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 gradient-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-primary/30 text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
