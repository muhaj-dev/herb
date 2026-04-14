"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  updateCondition,
  deleteCondition,
} from "@/lib/actions/condition-actions";
import type { Category, Condition } from "@/lib/supabase/types";

type DiseaseOption = { id: string; name: string; status: string };

export default function EditConditionForm({
  condition,
  categories,
  diseases,
  initialDiseaseIds,
}: {
  condition: Condition;
  categories: Category[];
  diseases: DiseaseOption[];
  initialDiseaseIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const [name, setName] = useState(condition.name);
  const [yorubaName, setYorubaName] = useState(condition.yoruba_name ?? "");
  const [yorubaDescription, setYorubaDescription] = useState(
    condition.yoruba_description ?? ""
  );
  const [description, setDescription] = useState(condition.description ?? "");
  const [icon, setIcon] = useState(condition.icon ?? "");
  const [iconBg, setIconBg] = useState(condition.icon_bg ?? "");
  const [badgeIcon, setBadgeIcon] = useState(condition.badge_icon ?? "");
  const [image, setImage] = useState(condition.image ?? "");
  const [categoryId, setCategoryId] = useState(condition.category_id ?? "");
  const [safetyNote, setSafetyNote] = useState(condition.safety_note ?? "");
  const [safetyLink, setSafetyLink] = useState(condition.safety_link ?? "");
  const [diseaseIds, setDiseaseIds] = useState<string[]>(initialDiseaseIds);
  const [diseaseQuery, setDiseaseQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedDiseases = diseases.filter((d) => diseaseIds.includes(d.id));
  const filteredDiseases = diseases
    .filter((d) => !diseaseIds.includes(d.id))
    .filter((d) =>
      diseaseQuery.trim()
        ? d.name.toLowerCase().includes(diseaseQuery.trim().toLowerCase())
        : true
    )
    .slice(0, 8);

  const toggleDisease = (id: string) => {
    setDiseaseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setError(null);
    if (!name.trim()) return setError("Condition name is required.");
    if (!yorubaName.trim()) return setError("Yoruba name is required.");
    if (!yorubaDescription.trim())
      return setError("Yoruba description is required.");

    startTransition(async () => {
      const result = await updateCondition(condition.id, {
        name: name.trim(),
        yoruba_name: yorubaName.trim(),
        yoruba_description: yorubaDescription.trim(),
        description: description.trim() || undefined,
        icon: icon.trim() || undefined,
        icon_bg: iconBg.trim() || undefined,
        badge_icon: badgeIcon.trim() || undefined,
        image: image.trim() || undefined,
        category_id: categoryId || undefined,
        safety_note: safetyNote.trim() || undefined,
        safety_link: safetyLink.trim() || undefined,
        disease_ids: diseaseIds,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin/conditions");
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startDelete(async () => {
      const result = await deleteCondition(condition.id);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin/conditions");
        router.refresh();
      }
    });
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/conditions"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Edit Condition
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}
          {confirmDelete ? (
            <>
              <span className="text-red-400 text-sm font-medium">
                Delete this condition?
              </span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full transition-all"
              >
                {isDeleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-slate-400 hover:text-white font-medium px-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-red-400 hover:text-red-300 font-medium px-4 py-2 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[20px]">
                delete
              </span>
              Delete
            </button>
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
              {isPending ? "hourglass_empty" : "save"}
            </span>
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        {error && (
          <div className="lg:hidden mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-8">
            {/* Basic Info */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  info
                </span>
                Basic Information
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="condition-name"
                  >
                    Condition Name (English) <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="condition-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="condition-yoruba-name"
                  >
                    Yoruba Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="condition-yoruba-name"
                    placeholder="e.g. Ìlera Ìfun"
                    type="text"
                    value={yorubaName}
                    onChange={(e) => setYorubaName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="condition-yoruba-description"
                  >
                    Yoruba Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[100px]"
                    id="condition-yoruba-description"
                    placeholder="Ṣàlàyé ipò ìlera yìí ní èdè Yorùbá..."
                    value={yorubaDescription}
                    onChange={(e) => setYorubaDescription(e.target.value)}
                  />
                </div>

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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

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
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Linked Diseases */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  coronavirus
                </span>
                Linked Diseases
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-4">
                Tag diseases that belong to this condition.
              </p>

              {selectedDiseases.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDiseases.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDisease(d.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#13ec37]/15 border border-[#13ec37]/40 text-[#13ec37] rounded-full text-xs font-medium hover:bg-[#13ec37]/25 transition-colors"
                    >
                      {d.name}
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Search diseases to add..."
                value={diseaseQuery}
                onChange={(e) => setDiseaseQuery(e.target.value)}
                className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm"
              />

              {diseases.length === 0 ? (
                <p className="text-slate-500 text-xs mt-3">
                  No diseases exist yet.
                </p>
              ) : filteredDiseases.length === 0 ? (
                <p className="text-slate-500 text-xs mt-3">
                  {diseaseQuery
                    ? "No matches."
                    : "All diseases are already linked."}
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-1 max-h-64 overflow-y-auto">
                  {filteredDiseases.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => toggleDisease(d.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#234829]/50 text-left transition-colors"
                      >
                        <span className="text-sm text-slate-200">{d.name}</span>
                        <span className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              d.status === "Active"
                                ? "bg-[#13ec37]/15 text-[#13ec37]"
                                : "bg-slate-600/30 text-slate-400"
                            }`}
                          >
                            {d.status}
                          </span>
                          <span className="material-symbols-outlined text-[18px] text-slate-400">
                            add
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Safety */}
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
                    type="text"
                    value={safetyLink}
                    onChange={(e) => setSafetyLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right / Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-6">
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
                    type="text"
                    value={badgeIcon}
                    onChange={(e) => setBadgeIcon(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="lg:hidden flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 text-[#102213] font-bold py-3 px-6 rounded-full shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPending ? "hourglass_empty" : "save"}
                </span>
                {isPending ? "Saving..." : "Save Changes"}
              </button>
              {confirmDelete ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 rounded-full"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 text-slate-400 hover:text-white font-medium py-3"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full text-red-400 hover:text-red-300 font-medium py-2 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                  Delete Condition
                </button>
              )}
              <Link
                href="/admin/conditions"
                className="w-full text-center text-slate-400 hover:text-white font-medium py-2"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
