"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Disease = {
  id: string;
  name: string;
  slug: string;
  yoruba_name: string;
  icon: string;
  hero_image: string | null;
  symptoms: string[];
  severity_label: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  diseases: Disease[];
};

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-500" },
  green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-500" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", ring: "ring-pink-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-500" },
};

export default function CategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const [activeId, setActiveId] = useState<string>(
    categories[0]?.id ?? ""
  );

  const active = useMemo(
    () => categories.find((c) => c.id === activeId) ?? categories[0],
    [categories, activeId]
  );

  if (!active) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 py-20 text-center">
        <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
          No categories yet
        </h1>
        <p className="text-on-surface/60">Check back soon.</p>
      </div>
    );
  }

  const activeColor = colorMap[active.color] ?? colorMap.green;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-on-surface/60 mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="text-on-surface">Categories</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-on-surface tracking-tight mb-2">
          Browse by Category
        </h1>
        <p className="text-on-surface/60 text-sm md:text-base max-w-2xl">
          Pick a category to see every disease and condition grouped under it.
        </p>
      </header>

      {/* Tabs */}
      <div
        className="flex gap-2 overflow-x-auto pb-3 mb-8 -mx-4 px-4"
        role="tablist"
        aria-label="Categories"
      >
        {categories.map((cat) => {
          const c = colorMap[cat.color] ?? colorMap.green;
          const isActive = cat.id === active.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(cat.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                isActive
                  ? `${c.bg} ${c.text} border-transparent shadow-sm`
                  : "bg-surface border-outline-variant/20 text-on-surface/70 hover:border-primary/40 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {cat.icon}
              </span>
              {cat.name}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/60"
                    : "bg-surface-container-lowest text-on-surface/50"
                }`}
              >
                {cat.diseases.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeColor.bg} ${activeColor.text}`}
        >
          <span className="material-symbols-outlined text-2xl">
            {active.icon}
          </span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-on-surface">
            {active.name}
          </h2>
          <p className="text-on-surface/60 text-sm">
            {active.diseases.length}{" "}
            {active.diseases.length === 1 ? "disease" : "diseases"}
          </p>
        </div>
        <Link
          href={`/categories/${active.slug}`}
          className="ml-auto hidden sm:inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
        >
          Open category page
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Diseases grid */}
      {active.diseases.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface/30 block mb-3">
            medical_information
          </span>
          <h3 className="text-lg font-bold text-on-surface mb-1">
            No diseases yet
          </h3>
          <p className="text-on-surface/60 text-sm">
            Check back soon — diseases will appear here as they&rsquo;re added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.diseases.map((d) => (
            <Link
              key={d.id}
              href={`/conditions/${d.slug}`}
              className="group flex flex-col rounded-xl overflow-hidden bg-surface border border-outline-variant/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="h-40 relative bg-surface-container-lowest overflow-hidden">
                {d.hero_image ? (
                  <Image
                    src={d.hero_image}
                    alt={d.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-primary/40">
                      {d.icon}
                    </span>
                  </div>
                )}
                {d.severity_label && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded uppercase tracking-wide text-primary">
                    {d.severity_label}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base md:text-lg font-serif font-bold text-on-surface group-hover:text-primary transition-colors">
                  {d.name}
                </h3>
                {d.yoruba_name && (
                  <p className="text-primary text-sm italic mt-0.5">
                    {d.yoruba_name}
                  </p>
                )}
                {d.symptoms.length > 0 && (
                  <p className="text-on-surface/60 text-xs mt-2 line-clamp-2">
                    {d.symptoms.slice(0, 3).join(" • ")}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                  View remedies
                  <span className="material-symbols-outlined text-sm">
                    arrow_right_alt
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
