"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type RemedyItem = {
  name: string;
  slug: string;
  scientific: string;
  desc: string;
  type: string;
  image: string | null;
  prepTime: string;
  isFeatured: boolean;
};

export default function RemediesClient({
  remedies,
}: {
  remedies: RemedyItem[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeType, setActiveType] = useState("All");

  // Derive unique types for filter pills
  const types = useMemo(() => {
    const set = new Set(remedies.map((r) => r.type).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [remedies]);

  const q = query.trim().toLowerCase();

  const filtered = remedies.filter((r) => {
    const matchesType = activeType === "All" || r.type === activeType;
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.scientific.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative bg-primary/5 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined absolute top-10 right-16 text-[200px] text-primary rotate-12">
            spa
          </span>
          <span className="material-symbols-outlined absolute bottom-10 left-10 text-[300px] text-primary -rotate-12">
            eco
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
            Botanical Library
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-main mb-6">
            Herbal Remedies
          </h1>
          <p className="text-lg md:text-xl text-on-surface/50 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Explore our curated collection of natural remedies — from ancient
            botanicals to time-tested herbal preparations for modern wellness.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded-full shadow-lg p-2 transition-shadow hover:shadow-xl">
              <span className="material-symbols-outlined text-on-surface/30 ml-4 text-2xl">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-text-main placeholder-on-surface/40 px-4 py-2 text-lg"
                placeholder="Search remedies by name, type, or keyword..."
                type="text"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-on-surface/40 hover:text-on-surface mr-2 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Pills + Grid ── */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          {/* Type filters */}
          {types.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeType === type
                      ? "bg-primary text-on-primary shadow-md"
                      : "bg-surface-container-lowest border border-outline-variant/20 text-on-surface/60 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {(q || activeType !== "All") && (
            <div className="mb-8 flex items-center justify-between">
              <p className="text-on-surface/60">
                {filtered.length > 0 ? (
                  <>
                    Showing{" "}
                    <span className="font-bold text-text-main">
                      {filtered.length}
                    </span>{" "}
                    remed{filtered.length !== 1 ? "ies" : "y"}
                    {q && (
                      <>
                        {" "}
                        for &ldquo;
                        <span className="font-medium text-primary">
                          {query}
                        </span>
                        &rdquo;
                      </>
                    )}
                    {activeType !== "All" && (
                      <>
                        {" "}
                        in{" "}
                        <span className="font-medium text-primary">
                          {activeType}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>No remedies found matching your criteria.</>
                )}
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveType("All");
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && !q && activeType === "All" && (
            <p className="text-center text-on-surface/40 py-16 text-lg">
              No remedies available yet. Check back soon.
            </p>
          )}

          {/* Remedies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((remedy) => (
              <Link
                key={remedy.slug}
                href={`/remedies/${remedy.slug}`}
                className="group relative block bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10"
              >
                {/* Card Image */}
                <div className="h-56 relative overflow-hidden bg-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {remedy.image ? (
                    <Image
                      src={remedy.image}
                      alt={remedy.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[80px] text-primary/20">
                        local_florist
                      </span>
                    </div>
                  )}
                  {remedy.type && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-white/90 backdrop-blur text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {remedy.type}
                      </span>
                    </div>
                  )}
                  {remedy.isFeatured && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-flex items-center gap-1 bg-amber-400/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-amber-900">
                        <span className="material-symbols-outlined text-sm">
                          star
                        </span>
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-text-main group-hover:text-primary transition-colors mb-1">
                    {remedy.name}
                  </h3>
                  {remedy.scientific && (
                    <p className="text-xs text-on-surface/40 italic mb-3">
                      {remedy.scientific}
                    </p>
                  )}
                  <p className="text-on-surface/50 text-sm mb-6 leading-relaxed line-clamp-2">
                    {remedy.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    {remedy.prepTime && (
                      <span className="text-xs text-on-surface/40 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          schedule
                        </span>
                        {remedy.prepTime}
                      </span>
                    )}
                    <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all ml-auto">
                      View Remedy
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety CTA ── */}
      <section className="bg-primary/5 border-t border-primary/10">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">
              health_and_safety
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-on-surface mb-4">
            Use Remedies Responsibly
          </h2>
          <p className="text-on-surface/50 mb-8 max-w-lg mx-auto text-sm sm:text-base">
            Natural doesn&apos;t always mean safe. Read our safety guide before
            trying any new herbal remedy, especially if you take medication.
          </p>
          <Link
            href="/safety"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">shield</span>
            Read Safety Guide
          </Link>
        </div>
      </section>
    </>
  );
}
