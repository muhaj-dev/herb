"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRemedy } from "@/lib/actions/remedy-actions";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function DeleteRemedyButton({
  remedyId,
  remedyName,
}: {
  remedyId: string;
  remedyName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteRemedy(remedyId);
      setShowConfirm(false);
      if (!("error" in result)) {
        router.refresh();
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
        title="Delete Remedy"
        message={`Are you sure you want to delete "${remedyName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        isPending={isPending}
      />
    </>
  );
}
