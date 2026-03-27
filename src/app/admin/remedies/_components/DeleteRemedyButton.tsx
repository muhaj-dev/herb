"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRemedy } from "@/lib/actions/remedy-actions";

export default function DeleteRemedyButton({
  remedyId,
  remedyName,
}: {
  remedyId: string;
  remedyName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete "${remedyName}"? This cannot be undone.`)) return;

    startTransition(async () => {
      const result = await deleteRemedy(remedyId);
      if ("error" in result) {
        alert(result.error);
      } else {
        router.refresh();
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
