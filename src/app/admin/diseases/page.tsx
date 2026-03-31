import Link from "next/link";
import type { Metadata } from "next";
import { getDiseases } from "@/lib/queries/diseases";
import DiseaseTable from "./_components/DiseaseTable";

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


export default async function DiseaseInventoryPage() {
  const rawDiseases = await getDiseases();

  const diseases = rawDiseases.map((d) => {
    const diseaseRemedies = d.disease_remedy;
    const allRemedies = diseaseRemedies.map((dr) => ({
      initial: dr.remedy.name.charAt(0).toUpperCase(),
      title: dr.remedy.name,
    }));
    const shown = allRemedies.slice(0, 2);
    const extra = Math.max(0, allRemedies.length - 2);
    const category = d.category ?? "Respiratory";
    const status = d.status ?? "Draft";
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

          <DiseaseTable diseases={diseases} />
        </div>
      </div>
    </>
  );
}
