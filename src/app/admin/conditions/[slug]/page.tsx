import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getConditionBySlug,
  getConditionDiseaseIds,
} from "@/lib/queries/conditions";
import { getCategories } from "@/lib/queries/categories";
import { getDiseaseOptions } from "@/lib/queries/diseases";
import EditConditionForm from "./_components/EditConditionForm";

export const metadata: Metadata = {
  title: "Edit Condition - Herbal Admin",
};

export default async function EditConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let condition;
  try {
    condition = await getConditionBySlug(slug);
  } catch {
    notFound();
  }
  if (!condition) notFound();

  const [categories, diseases, linkedDiseaseIds] = await Promise.all([
    getCategories(),
    getDiseaseOptions(),
    getConditionDiseaseIds(condition.id),
  ]);

  return (
    <EditConditionForm
      condition={condition}
      categories={categories}
      diseases={diseases}
      initialDiseaseIds={linkedDiseaseIds}
    />
  );
}
