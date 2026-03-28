"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDisease } from "@/lib/actions/disease-actions";
import type { Remedy } from "@/lib/supabase/types";

const toolbarButtons = [
  { icon: "format_bold" },
  { icon: "format_italic" },
  { icon: "format_underlined" },
  null,
  { icon: "format_list_bulleted" },
  { icon: "format_list_numbered" },
  null,
  { icon: "link" },
  { icon: "image" },
];

export default function AddDiseaseForm({ remedies }: { remedies: Remedy[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [icon, setIcon] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [selectedRemedyIds, setSelectedRemedyIds] = useState<string[]>([]);
  const [remedySearch, setRemedySearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addSymptom = () => {
    const trimmed = symptomInput.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
    }
    setSymptomInput("");
  };

  const removeSymptom = (s: string) =>
    setSymptoms(symptoms.filter((x) => x !== s));

  const toggleRemedy = (id: string) =>
    setSelectedRemedyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedRemedies = remedies.filter((r) =>
    selectedRemedyIds.includes(r.id)
  );
  const filteredRemedies = remedies.filter(
    (r) =>
      !selectedRemedyIds.includes(r.id) &&
      r.name.toLowerCase().includes(remedySearch.toLowerCase())
  );

  const handleSubmit = () => {
    setError(null);
    if (!name.trim()) return setError("Disease name is required.");
    if (!category) return setError("Please select a category.");
    if (!description.trim()) return setError("Description is required.");

    startTransition(async () => {
      const result = await createDisease({
        name: name.trim(),
        scientific_name: scientificName.trim() || undefined,
        category,
        symptoms,
        description: description.trim(),
        icon: icon.trim() || undefined,
        hero_image: heroImage.trim() || undefined,
        status,
        is_featured: isFeatured,
        remedy_ids: selectedRemedyIds,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin/diseases");
      }
    });
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Add New Disease
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}
          <Link
            href="/admin/diseases"
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
            {isPending ? "Publishing..." : "Publish Disease"}
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
                {/* Disease Name */}
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="disease-name"
                  >
                    Disease Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                    id="disease-name"
                    placeholder="e.g. Chronic Bronchitis"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Category + Scientific Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                      htmlFor="category"
                    >
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all cursor-pointer"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="respiratory">Respiratory System</option>
                        <option value="digestive">Digestive System</option>
                        <option value="nervous">Nervous System</option>
                        <option value="cardiovascular">Cardiovascular</option>
                        <option value="skin">Skin Conditions</option>
                        <option value="musculoskeletal">Musculoskeletal</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                      htmlFor="scientific-name"
                    >
                      Scientific/Medical Name
                    </label>
                    <input
                      className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                      id="scientific-name"
                      placeholder="e.g. Bronchitis chronica"
                      type="text"
                      value={scientificName}
                      onChange={(e) => setScientificName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Icon & Hero Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                      htmlFor="icon"
                    >
                      Icon (Material Symbol name)
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                        id="icon"
                        placeholder="e.g. respiratory"
                        type="text"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                      />
                      {icon && (
                        <span className="material-symbols-outlined text-[#13ec37] text-2xl shrink-0">
                          {icon}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                      htmlFor="hero-image"
                    >
                      Hero Image URL
                    </label>
                    <input
                      className="w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all"
                      id="hero-image"
                      placeholder="https://example.com/image.jpg"
                      type="url"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Common Symptoms */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Common Symptoms
                  </label>
                  <div className="bg-[#112214] border border-[#234829] rounded-lg p-3 min-h-[100px]">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="bg-[#234829] text-slate-200 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1"
                        >
                          {symptom}
                          <button
                            className="hover:text-red-400"
                            type="button"
                            onClick={() => removeSymptom(symptom)}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              close
                            </span>
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      className="w-full bg-transparent border-none p-0 text-white placeholder-slate-600 focus:ring-0 text-sm outline-none"
                      placeholder="Type a symptom and press Enter..."
                      type="text"
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSymptom();
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Press Enter to add multiple symptoms.
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  description
                </span>
                Detailed Description <span className="text-red-400">*</span>
              </h3>

              {/* Toolbar */}
              <div className="border border-[#234829] rounded-t-lg bg-[#112214] p-2 flex gap-1 border-b-0">
                {toolbarButtons.map((btn, i) =>
                  btn === null ? (
                    <div
                      key={`sep-${i}`}
                      className="w-px h-6 bg-[#234829] mx-1 self-center"
                    />
                  ) : (
                    <button
                      key={btn.icon}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1a3320] rounded transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {btn.icon}
                      </span>
                    </button>
                  )
                )}
              </div>
              <textarea
                className="w-full bg-[#112214] border border-[#234829] rounded-b-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[300px]"
                placeholder="Write a comprehensive description about the disease, its origins, and general impact on health..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* ── Right Column: Sidebar ── */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Link Remedies */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 sticky top-28">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec37]">
                    medication
                  </span>
                  Link Remedies
                </h3>
                <span className="bg-[#13ec37]/10 text-[#13ec37] text-xs font-bold px-2 py-1 rounded-full">
                  {selectedRemedyIds.length} Selected
                </span>
              </div>

              {/* Search */}
              <div className="relative group mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-[#13ec37] transition-colors text-[20px]">
                  search
                </span>
                <input
                  className="w-full bg-[#112214] border border-[#234829] text-sm rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#13ec37] focus:border-[#13ec37] transition-all"
                  placeholder="Search herbal remedies..."
                  type="text"
                  value={remedySearch}
                  onChange={(e) => setRemedySearch(e.target.value)}
                />
              </div>

              {/* Selected */}
              {selectedRemedies.length > 0 && (
                <div className="space-y-3 mb-4 sm:mb-6">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Selected Remedies
                  </p>
                  {selectedRemedies.map((remedy) => (
                    <div
                      key={remedy.id}
                      className="flex items-center justify-between bg-[#112214] p-3 rounded-lg border border-[#13ec37]/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#234829] flex items-center justify-center text-[#13ec37]">
                          <span className="material-symbols-outlined text-lg">
                            spa
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {remedy.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {remedy.type ?? "Herbal"}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        type="button"
                        onClick={() => toggleRemedy(remedy.id)}
                      >
                        <span className="material-symbols-outlined">
                          remove_circle
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedRemedies.length > 0 && (
                <div className="h-px bg-[#234829] w-full my-4" />
              )}

              {/* Available Remedies */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  {remedySearch ? "Search Results" : "All Remedies"}
                </p>
                {filteredRemedies.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    {remedySearch ? "No remedies found" : "All remedies selected"}
                  </p>
                ) : (
                  filteredRemedies.map((remedy) => (
                    <div
                      key={remedy.id}
                      className="flex items-center justify-between p-2 hover:bg-[#112214] rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#234829] group-hover:bg-[#1a3320] text-slate-400 group-hover:text-slate-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">
                            local_florist
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-300 group-hover:text-white">
                            {remedy.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {remedy.type ?? "Herbal"}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-slate-500 hover:text-[#13ec37] transition-colors"
                        type="button"
                        onClick={() => toggleRemedy(remedy.id)}
                      >
                        <span className="material-symbols-outlined">
                          add_circle
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">
                Visibility
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Status</p>
                    <p className="text-xs text-slate-400">Visible to users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#234829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec37]" />
                  </label>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#234829]">
                  <div>
                    <p className="text-sm font-medium text-white">Featured</p>
                    <p className="text-xs text-slate-400">Show on homepage</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#234829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec37]" />
                  </label>
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
                {isPending ? "Publishing..." : "Publish Disease"}
              </button>
              <Link
                href="/admin/diseases"
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
