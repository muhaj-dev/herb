import { notFound } from "next/navigation";
import { getDiseaseBySlug } from "@/lib/queries/diseases";
import { getAllRemedies } from "@/lib/queries/remedies";
import { getConditions } from "@/lib/queries/conditions";
import { createClient } from "@/lib/supabase/server";
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

  const [allRemedies, allConditions] = await Promise.all([
    getAllRemedies(),
    getConditions(),
  ]);
  const remedyOptions = allRemedies.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
  }));
  const conditionOptions = allConditions.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const supabase = await createClient();
  const { data: links } = await supabase
    .from("condition_diseases")
    .select("condition_id")
    .eq("disease_id", disease.id);
  const linkedConditionIds = (links ?? []).map((r) => r.condition_id);

  return (
    <DiseaseDetailClient
      disease={disease}
      allRemedies={remedyOptions}
      allConditions={conditionOptions}
      linkedConditionIds={linkedConditionIds}
    />
  );
}
