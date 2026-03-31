"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDisease } from "@/lib/actions/disease-actions";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function DeleteDiseaseButton({
  diseaseId,
  diseaseName,
}: {
  diseaseId: string;
  diseaseName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteDisease(diseaseId);
        setShowConfirm(false);
        router.refresh();
      } catch {
        setShowConfirm(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors disabled:opacity-50"
        title="Delete"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isPending ? "hourglass_empty" : "delete"}
        </span>
      </button>
      <ConfirmModal
        open={showConfirm}
        title="Delete Disease"
        message={`Are you sure you want to delete "${diseaseName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        isPending={isPending}
      />
    </>
  );
}
