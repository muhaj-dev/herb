"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/actions/auth-actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn({ email, password, redirectTo });
      if (result && "error" in result) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-slate-300 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-slate-300 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#102213] font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isPending ? "hourglass_empty" : "login"}
        </span>
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
