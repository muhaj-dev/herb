import type { Metadata } from "next";
import { getCategoriesWithDiseases } from "@/lib/queries/categories";
import CategoriesClient from "./_components/CategoriesClient";

export const metadata: Metadata = {
  title: "Browse Categories - HerbalWisdom",
  description:
    "Explore herbal categories and discover the diseases and conditions under each.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithDiseases();

  const data = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon ?? "category",
    color: c.color ?? "green",
    diseases: c.diseases.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      yoruba_name: d.yoruba_name || "",
      icon: d.icon ?? "local_hospital",
      hero_image: d.hero_image ?? null,
      symptoms: d.symptoms ?? [],
      severity_label: d.severity_label ?? null,
    })),
  }));

  return <CategoriesClient categories={data} />;
}
