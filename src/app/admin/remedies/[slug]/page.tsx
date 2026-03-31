import { notFound } from "next/navigation";
import { getRemedyBySlug } from "@/lib/queries/remedies";
import { getDiseases } from "@/lib/queries/diseases";
import RemedyDetailClient from "./_components/RemedyDetailClient";

export default async function RemedyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let remedy;
  try {
    remedy = await getRemedyBySlug(slug);
  } catch {
    notFound();
  }

  const rawDiseases = await getDiseases();
  const diseases = rawDiseases.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  return <RemedyDetailClient remedy={remedy} diseases={diseases} />;
}
