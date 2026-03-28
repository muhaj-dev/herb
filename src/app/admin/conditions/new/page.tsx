import type { Metadata } from "next";
import { getCategories } from "@/lib/queries/categories";
import AddConditionForm from "./_components/AddConditionForm";

export const metadata: Metadata = {
  title: "Add New Condition - Herbal Admin",
};

export default async function AddNewConditionPage() {
  const categories = await getCategories();
  return <AddConditionForm categories={categories} />;
}
