"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCondition } from "@/lib/actions/condition-actions";
import type { Category } from "@/lib/supabase/types";

export default function AddConditionForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [iconBg, setIconBg] = useState("");
  const [badgeIcon, setBadgeIcon] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [safetyNote, setSafetyNote] = useState("");
  const [safetyLink, setSafetyLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!name.trim()) return setError("Condition name is required.");

    startTransition(async () => {
      const result = await createCondition({
        name: name.trim(),
        description: description.trim() || undefined,
        icon: icon.trim() || undefined,
        icon_bg: iconBg.trim() || undefined,
        badge_icon: badgeIcon.trim() || undefined,
        image: image.trim() || undefined,
        category_id: categoryId || undefined,
        safety_note: safetyNote.trim() || undefined,
        safety_link: safetyLink.trim() || undefined,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin/conditions");
      }
    });
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/conditions"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Add New Condition
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}
          <Link
            href="/admin/conditions"
            className="text-slate-400 hover:text-white font-medium px-4 py-2"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#102213] font-bold py-2 px-6 rounded-full shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isPending ? "hourglass_empty" : "publish"}
            </span>
            {isPending ? "Saving..." : "Save Condition"}
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        {/* Mobile error */}
        {error && (
          <div className="lg:hidden mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-8">
            {/* Basic Information */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  info
                </span>
                Basic Information
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {/* Condition Name */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="condition-name"
                  >
                    Condition Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="condition-name"
                    placeholder="e.g. Headaches & Migraines"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all cursor-pointer"
                      id="category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">No Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[150px]"
                    id="description"
                    placeholder="Describe this health condition..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="image"
                  >
                    Image URL
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  health_and_safety
                </span>
                Safety Information
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="safety-note"
                  >
                    Safety Note
                  </label>
                  <textarea
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[100px]"
                    id="safety-note"
                    placeholder="Any safety warnings or precautions..."
                    value={safetyNote}
                    onChange={(e) => setSafetyNote(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="safety-link"
                  >
                    Safety Reference Link
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="safety-link"
                    placeholder="https://example.com/safety-info"
                    type="text"
                    value={safetyLink}
                    onChange={(e) => setSafetyLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Sidebar ── */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Icons */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 sticky top-28">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  palette
                </span>
                Appearance
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="icon"
                  >
                    Icon (Material Symbol name)
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      className="flex-1 bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                      id="icon"
                      placeholder="e.g. neurology"
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    {icon && (
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-[#13ec37]">
                          {icon}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="icon-bg"
                  >
                    Icon Background Color
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="icon-bg"
                    placeholder="e.g. #234829"
                    type="text"
                    value={iconBg}
                    onChange={(e) => setIconBg(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="badge-icon"
                  >
                    Badge Icon (Material Symbol name)
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="badge-icon"
                    placeholder="e.g. verified"
                    type="text"
                    value={badgeIcon}
                    onChange={(e) => setBadgeIcon(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Mobile submit */}
            <div className="lg:hidden flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#102213] font-bold py-3 px-6 rounded-full shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPending ? "hourglass_empty" : "publish"}
                </span>
                {isPending ? "Saving..." : "Save Condition"}
              </button>
              <Link
                href="/admin/conditions"
                className="w-full text-center text-slate-400 hover:text-white font-medium py-2"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-12 py-6 text-center text-slate-500 text-sm border-t border-[#234829]">
          &copy; {new Date().getFullYear()} Herbal Admin Dashboard. All rights
          reserved.
        </footer>
      </div>
    </>
  );
}
