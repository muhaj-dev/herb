import { notFound } from "next/navigation";
import { getDiseaseBySlug } from "@/lib/queries/diseases";
import { getAllRemedies } from "@/lib/queries/remedies";
import DiseaseDetailClient from "./_components/DiseaseDetailClient";

export default async function DiseaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let disease;
  try {
    disease = await getDiseaseBySlug(id);
  } catch {
    notFound();
  }

  const allRemedies = await getAllRemedies();
  const remedyOptions = allRemedies.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
  }));

  return <DiseaseDetailClient disease={disease} allRemedies={remedyOptions} />;
}
