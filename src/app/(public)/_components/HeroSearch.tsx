"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/conditions?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/conditions");
    }
  };

  return (
    <div className="w-full max-w-2xl mt-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-primary text-2xl">
            search
          </span>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full h-12 sm:h-14 pl-12 pr-28 sm:pr-32 rounded-xl border-0 ring-4 ring-white/20 focus:ring-primary/50 text-on-surface placeholder:text-on-surface/40 bg-white shadow-xl text-sm sm:text-base transition-shadow"
          placeholder="Search for a disease, symptom or herb..."
          type="text"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            className="h-10 px-6 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-primary/90 transition-colors"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
      <p className="mt-3 text-xs text-gray-300 flex items-center justify-center gap-1 opacity-80">
        <span className="material-symbols-outlined text-[14px]">info</span>
        Results are for informational purposes only. Consult a professional.
      </p>
    </div>
  );
}
