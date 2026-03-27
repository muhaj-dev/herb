import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllRemediesAdmin } from "@/lib/queries/remedies";
import DeleteRemedyButton from "./_components/DeleteRemedyButton";
import Pagination, { PER_PAGE } from "../_components/Pagination";

export const metadata: Metadata = {
  title: "Remedy Inventory - Herbal Admin",
};

const statusColor = (active: boolean) =>
  active
    ? { dot: "bg-[#13ec37]", ping: true, label: "Active" }
    : { dot: "bg-yellow-500", ping: false, label: "Inactive" };

export default async function RemedyInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1"));
  const remedies = await getAllRemediesAdmin();

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
          <span className="text-white">Remedies</span>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Remedy Inventory
              </h2>
              <p className="text-slate-400 max-w-xl text-xs sm:text-lg">
                Manage your database of herbal remedies, preparations, and dosage information.
              </p>
            </div>
            <Link
              href="/admin/remedies/new"
              className="flex items-center gap-2 rounded-lg bg-[#13ec37] px-4 py-2 sm:px-6 sm:py-3 text-[#102213] font-bold text-sm sm:text-base hover:bg-[#13ec37]/90 transition-colors shadow-[0_0_15px_rgba(19,236,55,0.3)]"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Remedy
            </Link>
          </div>

          {/* Summary badge */}
          <div className="flex flex-wrap gap-2">
            <span className="group flex items-center gap-2 rounded-lg bg-[#13ec37] px-4 py-2 text-sm font-bold text-[#102213]">
              All ({remedies.length})
            </span>
          </div>

          {/* ── Data Table ── */}
          <div className="rounded-2xl border border-white/5 bg-[#162e1b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Remedy
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">
                      Created
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {remedies.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE).map((remedy) => {
                    const st = statusColor(remedy.is_active);
                    return (
                      <tr
                        key={remedy.id}
                        className="group hover:bg-[#1c3b22] transition-colors"
                      >
                        {/* Name + Image */}
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
                        {/* Type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border bg-slate-900/40 text-slate-200 border-slate-800">
                            {remedy.type ?? "—"}
                          </span>
                        </td>
                        {/* Status */}
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
                        {/* Featured */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {remedy.is_featured ? (
                            <span className="text-[#13ec37] text-xs font-bold bg-[#13ec37]/10 px-2 py-1 rounded-full">
                              Featured
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">—</span>
                          )}
                        </td>
                        {/* Created */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                          {new Date(remedy.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </td>
                        {/* Actions */}
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
                  })}
                </tbody>
              </table>
            </div>

            <Pagination totalItems={remedies.length} currentPage={currentPage} basePath="/admin/remedies" />
          </div>
        </div>
      </div>
    </>
  );
}
