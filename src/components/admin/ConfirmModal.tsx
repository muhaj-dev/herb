"use client";

import { useEffect, useRef } from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isPending = false,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="fixed inset-0 z-50 bg-transparent backdrop:bg-black/60"
    >
      <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <span className="material-symbols-outlined text-red-400">
              warning
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors font-bold text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && (
              <span className="material-symbols-outlined text-[16px] animate-spin">
                hourglass_empty
              </span>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
