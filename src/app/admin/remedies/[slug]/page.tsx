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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diseases = rawDiseases.map((d: any) => ({
    id: d.id as string,
    name: d.name as string,
  }));

  return <RemedyDetailClient remedy={remedy} diseases={diseases} />;
}
