import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/queries/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryBySlug(slug);
  if (!result) return { title: "Category Not Found" };
  return {
    title: `${result.category.name} — Herbalw`,
    description: `Diseases and conditions under ${result.category.name}.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCategoryBySlug(slug);
  if (!result) notFound();

  const { category, diseases } = result;

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
        <Link href="/conditions" className="hover:text-primary">
          Categories
        </Link>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="text-on-surface">{category.name}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center gap-5 mb-10">
        <div
          className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl flex items-center justify-center border border-outline-variant/20"
          style={{
            backgroundColor: category.color ? `${category.color}15` : undefined,
          }}
        >
          <span
            className="material-symbols-outlined text-3xl md:text-4xl"
            style={{ color: category.color ?? "var(--color-primary)" }}
          >
            {category.icon ?? "category"}
          </span>
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-on-surface tracking-tight">
            {category.name}
          </h1>
          {category.yoruba_name && (
            <p className="text-primary text-base md:text-lg italic mt-1">
              {category.yoruba_name}
            </p>
          )}
          <p className="text-on-surface/60 text-sm mt-2">
            {diseases.length} {diseases.length === 1 ? "disease" : "diseases"}{" "}
            under this category
          </p>
        </div>
      </header>

      {/* Diseases Grid */}
      {diseases.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface/30 block mb-3">
            medical_information
          </span>
          <h2 className="text-lg font-bold text-on-surface mb-1">
            No diseases yet
          </h2>
          <p className="text-on-surface/60 text-sm">
            Check back soon — diseases will appear here as they&rsquo;re added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {diseases.map((d) => (
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
                      {d.icon ?? "local_hospital"}
                    </span>
                  </div>
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
                {d.symptoms?.length > 0 && (
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
