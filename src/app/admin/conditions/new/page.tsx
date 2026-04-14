import type { Metadata } from "next";
import { getCategories } from "@/lib/queries/categories";
import { getDiseaseOptions } from "@/lib/queries/diseases";
import AddConditionForm from "./_components/AddConditionForm";

export const metadata: Metadata = {
  title: "Add New Condition - Herbal Admin",
};

export default async function AddNewConditionPage() {
  const [categories, diseases] = await Promise.all([
    getCategories(),
    getDiseaseOptions(),
  ]);
  return <AddConditionForm categories={categories} diseases={diseases} />;
}
