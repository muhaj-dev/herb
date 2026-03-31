import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublicDiseases } from "@/lib/queries/diseases";
import ConditionsClient from "./_components/ConditionsClient";

export const metadata: Metadata = {
  title: "Browse Conditions - HerbalWisdom",
  description:
    "Select a condition to discover time-honored botanical remedies backed by modern science.",
};

export default async function ConditionsPage() {
  const diseases = await getPublicDiseases();

  const conditions = diseases.map((d) => ({
    name: d.name,
    slug: d.slug,
    desc: Array.isArray(d.description) ? d.description.join(" ") : "",
    remedyCount: d.disease_remedy.length,
    icon: d.icon ?? "local_hospital",
    category: d.category ?? "",
    image: d.hero_image ?? null,
    symptoms: d.symptoms ?? [],
  }));

  return (
    <Suspense>
      <ConditionsClient conditions={conditions} />
    </Suspense>
  );
}
