"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Condition } from "@/lib/supabase/types";
import { deleteCondition } from "@/lib/actions/condition-actions";

type ConditionWithCategory = Condition & {
  category_name: string | null;
  disease_count: number;
};

const PER_PAGE = 10;

export default function ConditionTable({
  conditions,
}: {
  conditions: ConditionWithCategory[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return conditions;
    const q = query.toLowerCase();
    return conditions.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.category_name && c.category_name.toLowerCase().includes(q))
    );
  }, [conditions, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safeCurrentPage - 1) * PER_PAGE,
    safeCurrentPage * PER_PAGE
  );

  function handleSearch(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteCondition(id);
      if ("error" in result) {
        setError(result.error);
      } else {
        setDeleteConfirmId(null);
        router.refresh();
      }
    });
  }

  return (
    <>
      {/* Search */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl sm:rounded-2xl bg-[#162e1b] p-3 sm:p-4 border border-white/5">
        <div className="relative w-full lg:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#13ec37]">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="block w-full rounded-lg border-none bg-[#234829]/50 py-3 pl-12 pr-4 text-white placeholder-[#13ec37]/60 focus:ring-2 focus:ring-[#13ec37] focus:bg-[#234829] transition-all"
            placeholder="Search conditions..."
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-2 rounded-lg bg-[#234829]/50 px-4 py-2 text-sm font-bold text-slate-300">
            Total: {conditions.length}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-2xl border border-white/5 bg-[#162e1b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Diseases
                </th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-600">
                      {query ? "search_off" : "healing"}
                    </span>
                    {query
                      ? `No conditions match "${query}"`
                      : "No conditions found. Add one to get started."}
                  </td>
                </tr>
              ) : (
                paged.map((condition) => (
                  <tr
                    key={condition.id}
                    className="group hover:bg-[#1c3b22] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10 flex items-center justify-center">
                          {condition.icon ? (
                            <span
                              className="material-symbols-outlined text-[20px] text-[#13ec37]"
                            >
                              {condition.icon}
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[20px] text-slate-500">
                              healing
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#13ec37] transition-colors">
                            {condition.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {condition.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {condition.category_name ? (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border bg-green-900/40 text-green-200 border-green-800">
                          {condition.category_name}
                        </span>
                      ) : (
                        <span className="text-slate-500">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-[#13ec37]/10 text-[#13ec37] text-xs font-bold px-2.5 py-1 rounded-full">
                        {condition.disease_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {deleteConfirmId === condition.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-400 mr-2">
                            Delete?
                          </span>
                          <button
                            onClick={() => handleDelete(condition.id)}
                            disabled={isPending}
                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="Confirm delete"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {isPending ? "hourglass_empty" : "check"}
                            </span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Cancel"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              close
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/conditions/${condition.slug}`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(condition.id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PER_PAGE && (
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 bg-white/5 px-6 py-4 gap-3">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-bold text-white">
                {(safeCurrentPage - 1) * PER_PAGE + 1}-
                {Math.min(safeCurrentPage * PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-white">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === safeCurrentPage
                      ? "bg-[#13ec37] text-[#102213] font-bold"
                      : "border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safeCurrentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}

        {filtered.length <= PER_PAGE && filtered.length > 0 && (
          <div className="border-t border-white/10 bg-white/5 px-6 py-4">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-bold text-white">{filtered.length}</span>{" "}
              condition{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
