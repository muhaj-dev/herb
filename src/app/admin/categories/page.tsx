import Link from "next/link";
import type { Metadata } from "next";
import { getCategoriesWithDiseaseCount } from "@/lib/queries/categories";
import CategoryTable from "./_components/CategoryTable";

export const metadata: Metadata = {
  title: "Categories - Herbal Admin",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithDiseaseCount();

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
          <span className="text-white">Categories</span>
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
                Categories
              </h2>
              <p className="text-slate-400 max-w-xl text-xs sm:text-lg">
                Manage condition categories used to organize and group health
                conditions.
              </p>
            </div>
          </div>

          <CategoryTable categories={categories} />
        </div>
      </div>
    </>
  );
}
