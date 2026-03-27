import type { Metadata } from "next";
import { getAllRemedies } from "@/lib/queries/remedies";
import AddDiseaseForm from "./_components/AddDiseaseForm";

export const metadata: Metadata = {
  title: "Add New Disease - Herbal Admin",
};

export default async function AddNewDiseasePage() {
  const remedies = await getAllRemedies();
  return <AddDiseaseForm remedies={remedies} />;
}
