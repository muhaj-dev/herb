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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions = diseases.map((d: any) => ({
    name: d.name as string,
    slug: d.slug as string,
    desc: Array.isArray(d.description) ? d.description.join(" ") : (d.description ?? ""),
    remedyCount: (d.disease_remedy ?? []).length,
    icon: d.icon ?? "local_hospital",
    category: (d.category ?? "") as string,
    image: d.hero_image ?? null,
    symptoms: (d.symptoms ?? []) as string[],
  }));

  return (
    <Suspense>
      <ConditionsClient conditions={conditions} />
    </Suspense>
  );
}
