"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDisease } from "@/lib/actions/disease-actions";

export default function DeleteDiseaseButton({
  diseaseId,
  diseaseName,
}: {
  diseaseId: string;
  diseaseName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete "${diseaseName}"? This cannot be undone.`)) return;

    startTransition(async () => {
      try {
        await deleteDisease(diseaseId);
        router.refresh();
      } catch {
        alert("Failed to delete disease.");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors disabled:opacity-50"
      title="Delete"
    >
      <span className="material-symbols-outlined text-[20px]">
        {isPending ? "hourglass_empty" : "delete"}
      </span>
    </button>
  );
}
