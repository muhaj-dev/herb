import type { Metadata } from "next";
import { getAllRemedies } from "@/lib/queries/remedies";
import { getConditions } from "@/lib/queries/conditions";
import AddDiseaseForm from "./_components/AddDiseaseForm";

export const metadata: Metadata = {
  title: "Add New Disease - Herbal Admin",
};

export default async function AddNewDiseasePage() {
  const [remedies, conditions] = await Promise.all([
    getAllRemedies(),
    getConditions(),
  ]);
  return (
    <AddDiseaseForm
      remedies={remedies}
      conditions={conditions.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
