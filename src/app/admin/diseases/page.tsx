import Link from "next/link";
import type { Metadata } from "next";
import { getDiseases } from "@/lib/queries/diseases";
import DeleteDiseaseButton from "./_components/DeleteDiseaseButton";
import Pagination, { PER_PAGE } from "../_components/Pagination";

export const metadata: Metadata = {
  title: "Disease Inventory - Herbal Admin",
};

const categoryColorMap: Record<string, string> = {
  Respiratory: "bg-blue-900/40 text-blue-200 border-blue-800",
  Inflammatory: "bg-orange-900/40 text-orange-200 border-orange-800",
  Neurological: "bg-purple-900/40 text-purple-200 border-purple-800",
  Digestive: "bg-green-900/40 text-green-200 border-green-800",
  "Oral Health": "bg-teal-900/40 text-teal-200 border-teal-800",
};

const statusColorMap: Record<string, { statusColor: string; ping: boolean }> = {
  Active: { statusColor: "bg-primary", ping: true },
  Draft: { statusColor: "bg-yellow-500", ping: false },
  Archived: { statusColor: "bg-slate-500", ping: false },
};

const categoryGradientMap: Record<string, string> = {
  Respiratory: "from-teal-800 to-green-900",
  Inflammatory: "from-yellow-800 to-orange-900",
  Neurological: "from-indigo-800 to-purple-900",
  Digestive: "from-green-800 to-lime-900",
  "Oral Health": "from-cyan-800 to-teal-900",
};

// Categories are derived from actual disease data


export default async function DiseaseInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1"));
  const rawDiseases = await getDiseases();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diseases = rawDiseases.map((d: any) => {
    const diseaseRemedies = (d.disease_remedy ?? []) as { remedy: { name: string } }[];
    const allRemedies = diseaseRemedies.map((dr) => ({
      initial: dr.remedy.name.charAt(0).toUpperCase(),
      title: dr.remedy.name,
    }));
    const shown = allRemedies.slice(0, 2);
    const extra = Math.max(0, allRemedies.length - 2);
    const category = (d.category as string) ?? "Respiratory";
    const status = (d.status as string) ?? "Draft";
    const { statusColor, ping } = statusColorMap[status] ?? {
      statusColor: "bg-slate-500",
      ping: false,
    };

    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      category,
      categoryColor:
        categoryColorMap[category] ??
        "bg-slate-900/40 text-slate-200 border-slate-800",
      gradient:
        categoryGradientMap[category] ?? "from-slate-800 to-slate-900",
      remedies: shown,
      extra,
      status,
      statusColor,
      ping,
      lastUpdated: new Date(d.updated_at ?? d.created_at).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      ),
    };
  });

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-2 text-sm text-[#13ec37]/80 font-medium">
          <Link href="/admin" className="hover:text-[#13ec37] hover:underline">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-white">Diseases</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#13ec37] rounded-full animate-pulse" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Disease Inventory
              </h2>
              <p className="text-slate-400 max-w-xl text-xs sm:text-lg">
                Manage your database of diseases, categorizations, and link them
                to effective herbal remedies.
              </p>
            </div>
            <Link
              href="/admin/diseases/new"
              className="flex items-center gap-2 rounded-lg bg-[#13ec37] px-4 py-2 sm:px-6 sm:py-3 text-[#102213] font-bold text-sm sm:text-base hover:bg-[#13ec37]/90 transition-colors shadow-[0_0_15px_rgba(19,236,55,0.3)]"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Disease
            </Link>
          </div>

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
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="group flex items-center gap-2 rounded-lg bg-[#13ec37] px-4 py-2 text-sm font-bold text-[#102213]">
                All ({diseases.length})
              </span>
            </div>
          </div>

          {/* ── Data Table ── */}
          <div className="rounded-2xl border border-white/5 bg-[#162e1b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Disease Name
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Remedies
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {diseases.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE).map((disease) => (
                    <tr
                      key={disease.id}
                      className="group hover:bg-[#1c3b22] transition-colors"
                    >
                      {/* Name */}
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
                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${disease.categoryColor}`}
                        >
                          {disease.category}
                        </span>
                      </td>
                      {/* Remedies */}
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
                      {/* Status */}
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
                      {/* Last Updated */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                        {disease.lastUpdated}
                      </td>
                      {/* Actions */}
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
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination totalItems={diseases.length} currentPage={currentPage} basePath="/admin/diseases" />
          </div>
        </div>
      </div>
    </>
  );
}
