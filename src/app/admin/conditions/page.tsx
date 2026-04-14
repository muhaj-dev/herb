import Link from "next/link";
import type { Metadata } from "next";
import { getConditions } from "@/lib/queries/conditions";
import { getCategories } from "@/lib/queries/categories";
import ConditionTable from "./_components/ConditionTable";

export const metadata: Metadata = {
  title: "Conditions - Herbal Admin",
};

export default async function ConditionsPage() {
  const [conditions, categories] = await Promise.all([
    getConditions(),
    getCategories(),
  ]);

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.id, c.name])
  );

  const conditionsWithCategory = conditions.map((c) => ({
    ...c,
    category_name: c.category_id ? categoryMap[c.category_id] ?? "Unknown" : null,
    disease_count: c.disease_count,
  }));

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
          <span className="text-white">Conditions</span>
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
                Conditions
              </h2>
              <p className="text-slate-400 max-w-xl text-xs sm:text-lg">
                Manage health conditions and link them to categories and
                remedies.
              </p>
            </div>
            <Link
              href="/admin/conditions/new"
              className="flex items-center gap-2 rounded-lg bg-[#13ec37] px-4 py-2 sm:px-6 sm:py-3 text-[#102213] font-bold text-sm sm:text-base hover:bg-[#13ec37]/90 transition-colors shadow-[0_0_15px_rgba(19,236,55,0.3)]"
            >
              <span className="material-symbols-outlined">add</span>
              Add Condition
            </Link>
          </div>

          <ConditionTable conditions={conditionsWithCategory} />
        </div>
      </div>
    </>
  );
}
