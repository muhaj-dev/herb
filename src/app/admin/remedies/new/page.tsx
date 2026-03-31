import type { Metadata } from "next";
import { getDiseases } from "@/lib/queries/diseases";
import AddRemedyForm from "./_components/AddRemedyForm";

export const metadata: Metadata = {
  title: "Add New Remedy - Herbal Admin",
};

export default async function AddNewRemedyPage() {
  const rawDiseases = await getDiseases();
  const diseases = rawDiseases.map((d) => ({
    id: d.id,
    name: d.name,
  }));
  return <AddRemedyForm diseases={diseases} />;
}
