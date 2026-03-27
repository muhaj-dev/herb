import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllRemedies } from "@/lib/queries/remedies";
import RemediesClient from "./_components/RemediesClient";

export const metadata: Metadata = {
  title: "Browse Remedies - HerbalWisdom",
  description:
    "Explore our curated collection of natural herbal remedies. Search by name, type, or browse the full botanical library.",
};

export default async function RemediesPage() {
  const remediesData = await getAllRemedies();

  const remedies = remediesData.map((r) => ({
    name: r.name,
    slug: r.slug,
    scientific: r.scientific_name ?? "",
    desc: r.short_description || r.description || "",
    type: r.type ?? "",
    image: r.image ?? null,
    prepTime: r.prep_time ?? "",
    isFeatured: r.is_featured,
  }));

  return (
    <Suspense>
      <RemediesClient remedies={remedies} />
    </Suspense>
  );
}
