"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import DeleteRemedyButton from "./DeleteRemedyButton";

const PER_PAGE = 10;

type Remedy = {
  id: string;
  name: string;
  slug: string;
  scientific_name: string | null;
  type: string | null;
  image: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

const statusColor = (active: boolean) =>
  active
    ? { dot: "bg-[#13ec37]", ping: true, label: "Active" }
    : { dot: "bg-yellow-500", ping: false, label: "Inactive" };

export default function RemedyTable({ remedies }: { remedies: Remedy[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = remedies;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.scientific_name?.toLowerCase().includes(q) ?? false) ||
          (r.type?.toLowerCase().includes(q) ?? false)
      );
    }

    if (typeFilter) {
      result = result.filter((r) => r.type === typeFilter);
    }

    return result;
  }, [remedies, query, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safeCurrentPage - 1) * PER_PAGE,
    safeCurrentPage * PER_PAGE
  );

  const types = useMemo(() => {
    const map = new Map<string, number>();
    remedies.forEach((r) => {
      const t = r.type ?? "Unknown";
      map.set(t, (map.get(t) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [remedies]);

  function handleSearch(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  function handleTypeFilter(type: string | null) {
    setTypeFilter(type);
    setCurrentPage(1);
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl sm:rounded-2xl bg-[#162e1b] p-3 sm:p-4 border border-white/5">
        <div className="relative w-full lg:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#13ec37]">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="block w-full rounded-lg border-none bg-[#234829]/50 py-3 pl-12 pr-4 text-white placeholder-[#13ec37]/60 focus:ring-2 focus:ring-[#13ec37] focus:bg-[#234829] transition-all"
            placeholder="Search remedies..."
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeFilter(null)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              !typeFilter
                ? "bg-[#13ec37] text-[#102213]"
                : "bg-[#234829]/50 text-slate-300 hover:bg-[#234829]"
            }`}
          >
            All ({remedies.length})
          </button>
          {types.map(([type, count]) => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                typeFilter === type
                  ? "bg-[#13ec37] text-[#102213]"
                  : "bg-[#234829]/50 text-slate-300 hover:bg-[#234829]"
              }`}
            >
              {type} ({count})
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
                <th className="px-6 py-4 font-bold tracking-wider">Remedy</th>
                <th className="px-6 py-4 font-bold tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Featured</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Created</th>
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
                      ? `No remedies match "${query}"`
                      : "No remedies found"}
                  </td>
                </tr>
              ) : (
                paged.map((remedy) => {
                  const st = statusColor(remedy.is_active);
                  return (
                    <tr
                      key={remedy.id}
                      className="group hover:bg-[#1c3b22] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/remedies/${remedy.slug}`}
                          className="flex items-center gap-3"
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#234829]">
                            {remedy.image ? (
                              <Image
                                src={remedy.image}
                                alt={remedy.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500 text-[18px]">
                                  local_florist
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#13ec37] transition-colors">
                              {remedy.name}
                            </div>
                            {remedy.scientific_name && (
                              <div className="text-xs text-slate-500 italic">
                                {remedy.scientific_name}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border bg-slate-900/40 text-slate-200 border-slate-800">
                          {remedy.type ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            {st.ping && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec37] opacity-75" />
                            )}
                            <span
                              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${st.dot}`}
                            />
                          </span>
                          <span className="text-white">{st.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {remedy.is_featured ? (
                          <span className="text-[#13ec37] text-xs font-bold bg-[#13ec37]/10 px-2 py-1 rounded-full">
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                        {new Date(remedy.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/remedies/${remedy.slug}`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </Link>
                          <DeleteRemedyButton
                            remedyId={remedy.id}
                            remedyName={remedy.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
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
