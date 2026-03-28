"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
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
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
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
        className="bg-primary text-on-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        Subscribe
      </button>
    </form>
  );
}
