"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions/newsletter-actions";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSubmitted(true);
        setEmail("");
      }
    });
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-primary mb-4">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <p className="text-lg font-bold text-on-surface mb-2">
          You&apos;re subscribed!
        </p>
        <p className="text-on-surface/50 text-sm">
          We&apos;ll send you weekly herbal wisdom straight to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="flex-1 rounded-lg border border-outline-variant/20 bg-surface-container-lowest focus:border-primary focus:ring-primary text-on-surface"
          placeholder="Enter your email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-on-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isPending ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}
    </form>
  );
}
