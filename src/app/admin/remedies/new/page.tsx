import type { Metadata } from "next";
import { getDiseases } from "@/lib/queries/diseases";
import AddRemedyForm from "./_components/AddRemedyForm";

export const metadata: Metadata = {
  title: "Add New Remedy - Herbal Admin",
};

export default async function AddNewRemedyPage() {
  const rawDiseases = await getDiseases();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diseases = rawDiseases.map((d: any) => ({
    id: d.id as string,
    name: d.name as string,
  }));
  return <AddRemedyForm diseases={diseases} />;
}
