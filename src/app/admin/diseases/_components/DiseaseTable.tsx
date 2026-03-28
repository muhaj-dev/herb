"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import DeleteDiseaseButton from "./DeleteDiseaseButton";

const PER_PAGE = 10;

type Disease = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryColor: string;
  gradient: string;
  remedies: { initial: string; title: string }[];
  extra: number;
  status: string;
  statusColor: string;
  ping: boolean;
  lastUpdated: string;
};

export default function DiseaseTable({ diseases }: { diseases: Disease[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = diseases;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.remedies.some((r) => r.title.toLowerCase().includes(q))
      );
    }

    if (statusFilter) {
      result = result.filter((d) => d.status === statusFilter);
    }

    return result;
  }, [diseases, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safeCurrentPage - 1) * PER_PAGE,
    safeCurrentPage * PER_PAGE
  );

  const statuses = useMemo(() => {
    const map = new Map<string, number>();
    diseases.forEach((d) => map.set(d.status, (map.get(d.status) ?? 0) + 1));
    return Array.from(map.entries());
  }, [diseases]);

  function handleSearch(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  function handleStatusFilter(status: string | null) {
    setStatusFilter(status);
    setCurrentPage(1);
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="mt-3 sm:mt-6 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl sm:rounded-2xl bg-[#162e1b] p-3 sm:p-4 border border-white/5">
        <div className="relative w-full lg:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#13ec37]">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="block w-full rounded-lg border-none bg-[#234829]/50 py-3 pl-12 pr-4 text-white placeholder-[#13ec37]/60 focus:ring-2 focus:ring-[#13ec37] focus:bg-[#234829] transition-all"
            placeholder="Search diseases or remedies..."
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter(null)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              !statusFilter
                ? "bg-[#13ec37] text-[#102213]"
                : "bg-[#234829]/50 text-slate-300 hover:bg-[#234829]"
            }`}
          >
            All ({diseases.length})
          </button>
          {statuses.map(([status, count]) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                statusFilter === status
                  ? "bg-[#13ec37] text-[#102213]"
                  : "bg-[#234829]/50 text-slate-300 hover:bg-[#234829]"
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-white/5 bg-[#162e1b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Disease Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold tracking-wider">Remedies</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Last Updated</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-600">
                      search_off
                    </span>
                    {query
                      ? `No diseases match "${query}"`
                      : "No diseases found"}
                  </td>
                </tr>
              ) : (
                paged.map((disease) => (
                  <tr
                    key={disease.id}
                    className="group hover:bg-[#1c3b22] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/diseases/${disease.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
                          <div
                            className={`w-full h-full bg-gradient-to-br ${disease.gradient}`}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#13ec37] transition-colors">
                            {disease.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            ID: #{disease.id}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${disease.categoryColor}`}
                      >
                        {disease.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2 overflow-hidden">
                        {disease.remedies.map((r) => (
                          <div
                            key={r.initial}
                            className="inline-block h-6 w-6 rounded-full bg-slate-700 ring-2 ring-[#162e1b] flex items-center justify-center text-[10px] text-white font-bold"
                            title={r.title}
                          >
                            {r.initial}
                          </div>
                        ))}
                        {disease.extra > 0 && (
                          <div className="inline-block h-6 w-6 rounded-full bg-slate-500 ring-2 ring-[#162e1b] flex items-center justify-center text-[10px] text-white font-bold">
                            +{disease.extra}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          {disease.ping && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec37] opacity-75" />
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${disease.statusColor}`}
                          />
                        </span>
                        <span className="text-white">{disease.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                      {disease.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/diseases/${disease.slug}`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </Link>
                        <DeleteDiseaseButton
                          diseaseId={disease.id}
                          diseaseName={disease.name}
                        />
                      </div>
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
              of <span className="font-bold text-white">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}

        {filtered.length <= PER_PAGE && filtered.length > 0 && (
          <div className="border-t border-white/10 bg-white/5 px-6 py-4">
            <p className="text-sm text-slate-400">
              Showing <span className="font-bold text-white">{filtered.length}</span>{" "}
              item{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
