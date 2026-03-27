"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Condition = {
  name: string;
  slug: string;
  desc: string;
  remedyCount: number;
  icon: string;
  category: string;
  image: string | null;
  symptoms: string[];
};

const trustBadges = [
  {
    icon: "verified",
    title: "Certified Safe",
    desc: "All remedies are vetted by our clinical herbalists for safety and efficacy.",
  },
  {
    icon: "science",
    title: "Lab Tested",
    desc: "We test for purity and potency to ensure you receive the highest quality botanicals.",
  },
  {
    icon: "local_shipping",
    title: "Global Shipping",
    desc: "Bringing nature's wisdom to your doorstep, wherever you are in the world.",
  },
];

export default function ConditionsClient({
  conditions,
}: {
  conditions: Condition[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const q = query.trim().toLowerCase();

  const filtered = q
    ? conditions.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.symptoms.some((s) => s.toLowerCase().includes(q))
      )
    : conditions;

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative bg-primary/5 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined absolute top-10 left-10 text-[200px] text-primary rotate-12">
            local_florist
          </span>
          <span className="material-symbols-outlined absolute bottom-10 right-10 text-[300px] text-primary -rotate-12">
            grass
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
            Holistic Healing
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-main mb-6">
            What Ails You Today?
          </h1>
          <p className="text-lg md:text-xl text-on-surface/50 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Select a condition below to discover time-honored botanical remedies
            backed by modern science. Our curated collection offers safe, natural
            pathways to wellness.
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
                placeholder="Search conditions, symptoms, or categories..."
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

      {/* ── Conditions Grid ── */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          {q && (
            <div className="mb-8 flex items-center justify-between">
              <p className="text-on-surface/60">
                {filtered.length > 0 ? (
                  <>
                    Showing{" "}
                    <span className="font-bold text-text-main">
                      {filtered.length}
                    </span>{" "}
                    result{filtered.length !== 1 ? "s" : ""} for &ldquo;
                    <span className="font-medium text-primary">{query}</span>
                    &rdquo;
                  </>
                ) : (
                  <>
                    No results found for &ldquo;
                    <span className="font-medium text-primary">{query}</span>
                    &rdquo;
                  </>
                )}
              </p>
              <button
                onClick={() => setQuery("")}
                className="text-sm text-primary hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}

          {filtered.length === 0 && !q && (
            <p className="text-center text-on-surface/40 py-16 text-lg">
              No conditions available yet. Check back soon.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((condition) => (
              <Link
                key={condition.slug}
                href={`/conditions/${condition.slug}`}
                className="group relative block bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10"
              >
                {/* Card Image / Fallback */}
                <div className="h-56 relative overflow-hidden bg-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {condition.image ? (
                    <Image
                      src={condition.image}
                      alt={condition.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[80px] text-primary/20">
                        {condition.icon}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                      <span className="material-symbols-outlined text-sm">
                        medication
                      </span>
                      {condition.remedyCount} Remed{condition.remedyCount !== 1 ? "ies" : "y"}
                    </span>
                  </div>
                  {condition.category && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-black/40 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {condition.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">
                        {condition.icon}
                      </span>
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-text-main">
                      {condition.name}
                    </h3>
                  </div>
                  {condition.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {condition.symptoms.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-surface-container-low text-on-surface/60 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                      {condition.symptoms.length > 3 && (
                        <span className="text-xs text-on-surface/40">
                          +{condition.symptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-on-surface/50 text-sm mb-6 leading-relaxed line-clamp-2">
                    {condition.desc}
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:underline decoration-1 underline-offset-4">
                    View Treatments
                    <span className="material-symbols-outlined text-lg ml-1 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-primary/5 border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex items-start gap-4">
              <div className="p-3 bg-surface-container-lowest rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined text-3xl">
                  {badge.icon}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-serif font-bold text-text-main">
                  {badge.title}
                </h4>
                <p className="text-sm text-on-surface/50 max-w-sm">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
