"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createRemedy } from "@/lib/actions/remedy-actions";
import MediaUpload from "@/components/admin/MediaUpload";

type Disease = { id: string; name: string };
type Ingredient = { name: string; quantity: string };

export default function AddRemedyForm({ diseases }: { diseases: Disease[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [yorubaName, setYorubaName] = useState("");
  const [yorubaDescription, setYorubaDescription] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [type, setType] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);
  const [preparationSteps, setPreparationSteps] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "" },
  ]);
  const [imageUrl, setImageUrl] = useState("");
  const [diseaseQuery, setDiseaseQuery] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [precautions, setPrecautions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredientRow = () =>
    setIngredients([...ingredients, { name: "", quantity: "" }]);

  const removeIngredientRow = (i: number) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i));

  const updateIngredient = (
    i: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = [...ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setIngredients(updated);
  };

  const toggleDisease = (id: string) =>
    setSelectedDiseaseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handlePublish = () => {
    setError(null);
    if (!name.trim()) return setError("Remedy name is required.");
    if (!yorubaName.trim()) return setError("Yoruba name is required.");
    if (!yorubaDescription.trim())
      return setError("Yoruba description is required.");

    startTransition(async () => {
      const result = await createRemedy({
        name: name.trim(),
        yoruba_name: yorubaName.trim(),
        yoruba_description: yorubaDescription.trim(),
        scientific_name: scientificName.trim() || undefined,
        type: type || undefined,
        prep_time: prepTime.trim() || undefined,
        short_description: shortDescription.trim() || undefined,
        disease_ids: selectedDiseaseIds,
        preparation_steps: preparationSteps.trim() || undefined,
        ingredients: ingredients.filter((ig) => ig.name.trim()),
        image: imageUrl.trim() || undefined,
        dosage: dosage.trim() || undefined,
        duration: duration.trim() || undefined,
        precautions: precautions.trim() || undefined,
        is_active: isActive,
        is_featured: isFeatured,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin");
      }
    });
  };

  const inputCls =
    "w-full bg-[#162b1b] border border-[#234829] rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#13ec37]/50 focus:border-[#13ec37] focus:outline-none transition-all";

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#234829] transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Add New Remedy
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#1a3320] border border-[#234829] rounded-lg hover:bg-[#234829] hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-[#102213] bg-[#13ec37] rounded-lg hover:bg-[#13ec37]/90 disabled:opacity-50 transition-colors shadow-lg shadow-[#13ec37]/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPending ? "hourglass_empty" : "publish"}
            </span>
            {isPending ? "Publishing..." : "Publish Remedy"}
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 max-w-[1200px] mx-auto w-full">
        {/* Mobile error */}
        {error && (
          <div className="lg:hidden mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-8">
            {/* Basic Details */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-[#234829] pb-3 sm:pb-4">
                <span className="material-symbols-outlined text-[#13ec37]">
                  description
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Basic Details
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="remedy-name"
                  >
                    Remedy Name (English) <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputCls}
                    id="remedy-name"
                    placeholder="e.g. Moringa Leaf Tea"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="remedy-yoruba-name"
                  >
                    Yoruba Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputCls}
                    id="remedy-yoruba-name"
                    placeholder="e.g. Ewé Igbálé"
                    type="text"
                    value={yorubaName}
                    onChange={(e) => setYorubaName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="remedy-yoruba-description"
                  >
                    Yoruba Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    id="remedy-yoruba-description"
                    placeholder="Ṣàlàyé oògùn náà àti àwọn ànfàní rẹ̀ ní èdè Yorùbá..."
                    rows={3}
                    value={yorubaDescription}
                    onChange={(e) => setYorubaDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2" htmlFor="scientific-name">
                      Scientific Name
                    </label>
                    <input
                      className={inputCls}
                      id="scientific-name"
                      placeholder="e.g. Curcuma longa"
                      type="text"
                      value={scientificName}
                      onChange={(e) => setScientificName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2" htmlFor="type">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        className={`${inputCls} appearance-none cursor-pointer`}
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        <option value="Herb">Herb</option>
                        <option value="Root">Root</option>
                        <option value="Spice">Spice</option>
                        <option value="Flower">Flower</option>
                        <option value="Bark">Bark</option>
                        <option value="Leaf">Leaf</option>
                        <option value="Seed">Seed</option>
                        <option value="Berry">Berry</option>
                        <option value="Mushroom">Mushroom</option>
                        <option value="Essential Oil">Essential Oil</option>
                        <option value="Tincture">Tincture</option>
                        <option value="Tea">Tea</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2" htmlFor="prep-time">
                      Prep Time
                    </label>
                    <input
                      className={inputCls}
                      id="prep-time"
                      placeholder="e.g. 15 minutes"
                      type="text"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2"
                    htmlFor="short-description"
                  >
                    Short Description
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    id="short-description"
                    placeholder="A brief overview of the remedy's benefits..."
                    rows={3}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <label className="block text-xs sm:text-sm font-medium text-slate-300">
                      Associated Diseases
                    </label>
                    <span className="bg-[#13ec37]/10 text-[#13ec37] text-xs font-bold px-2 py-0.5 rounded-full">
                      {selectedDiseaseIds.length} Selected
                    </span>
                  </div>

                  {selectedDiseaseIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {diseases
                        .filter((d) => selectedDiseaseIds.includes(d.id))
                        .map((d) => (
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
                    placeholder="Search diseases to link..."
                    value={diseaseQuery}
                    onChange={(e) => setDiseaseQuery(e.target.value)}
                    className={`${inputCls} text-sm`}
                  />

                  {diseases.length === 0 ? (
                    <p className="text-slate-500 text-xs mt-3">
                      No diseases in database yet. Create one first.
                    </p>
                  ) : (
                    (() => {
                      const filtered = diseases
                        .filter((d) => !selectedDiseaseIds.includes(d.id))
                        .filter((d) =>
                          diseaseQuery.trim()
                            ? d.name
                                .toLowerCase()
                                .includes(diseaseQuery.trim().toLowerCase())
                            : true
                        )
                        .slice(0, 8);
                      if (filtered.length === 0) {
                        return (
                          <p className="text-slate-500 text-xs mt-3">
                            {diseaseQuery ? "No matches." : "All diseases are linked."}
                          </p>
                        );
                      }
                      return (
                        <ul className="mt-3 flex flex-col gap-1 max-h-56 overflow-y-auto">
                          {filtered.map((d) => (
                            <li key={d.id}>
                              <button
                                type="button"
                                onClick={() => toggleDisease(d.id)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#234829]/50 text-left transition-colors"
                              >
                                <span className="text-sm text-slate-200">{d.name}</span>
                                <span className="material-symbols-outlined text-[18px] text-slate-400">
                                  add
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>

            {/* Preparation Instructions */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-[#234829] pb-3 sm:pb-4">
                <span className="material-symbols-outlined text-[#13ec37]">
                  blender
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Preparation Instructions
                </h3>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                  Step-by-step Guide
                </label>
                <textarea
                  className={`${inputCls} min-h-[200px]`}
                  placeholder={"Step 1: Clean the roots thoroughly\nStep 2: Grind into a fine paste\nStep 3: Mix with warm water"}
                  value={preparationSteps}
                  onChange={(e) => setPreparationSteps(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  One step per line. Optionally use &quot;Title: description&quot; format.
                </p>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#234829] pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec37]">
                    grocery
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Ingredients List
                  </h3>
                </div>
                <button
                  className="text-xs text-[#13ec37] hover:text-white border border-[#13ec37]/30 hover:bg-[#13ec37]/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                  type="button"
                  onClick={addIngredientRow}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    add
                  </span>
                  Add Row
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 px-1">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-4">Quantity</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
                {ingredients.map((ig, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-3 items-center"
                  >
                    <div className="col-span-6">
                      <input
                        className="w-full bg-[#162b1b] border border-[#234829] rounded-lg px-3 py-2 text-sm text-white focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] focus:outline-none"
                        placeholder="Ingredient Name"
                        type="text"
                        value={ig.name}
                        onChange={(e) =>
                          updateIngredient(i, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        className="w-full bg-[#162b1b] border border-[#234829] rounded-lg px-3 py-2 text-sm text-white focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] focus:outline-none"
                        placeholder="e.g. 2 tbsp"
                        type="text"
                        value={ig.quantity}
                        onChange={(e) =>
                          updateIngredient(i, "quantity", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2 text-right">
                      <button
                        className="text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-[#234829] transition-colors"
                        type="button"
                        onClick={() => removeIngredientRow(i)}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-4 sm:gap-8">
            {/* Remedy Image */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-[#234829] pb-3 sm:pb-4">
                <span className="material-symbols-outlined text-[#13ec37]">
                  image
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Remedy Image
                </h3>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                  Remedy Media
                </label>
                <MediaUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  accept="any"
                  placeholder="https://example.com/image.jpg"
                  uploadLabel="Click or drop an image / short video"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Upload from your device, or paste a direct URL.
                </p>
              </div>
            </div>

            {/* Usage & Dosage */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-[#234829] pb-3 sm:pb-4">
                <span className="material-symbols-outlined text-[#13ec37]">
                  medication
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Usage &amp; Dosage
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Recommended Dosage
                  </label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Twice daily after meals"
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Duration
                  </label>
                  <input
                    className={inputCls}
                    placeholder="e.g. 2 weeks"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Precautions
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    placeholder={"Not recommended for...\nOne precaution per line"}
                    rows={3}
                    value={precautions}
                    onChange={(e) => setPrecautions(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-[#234829] pb-3 sm:pb-4">
                <span className="material-symbols-outlined text-[#13ec37]">
                  tune
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Settings
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      Active Status
                    </span>
                    <span className="text-xs text-slate-400">
                      Visible to users
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#234829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec37]" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      Featured Remedy
                    </span>
                    <span className="text-xs text-slate-400">
                      Show on homepage
                    </span>
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
                onClick={handlePublish}
                disabled={isPending}
                className="w-full bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 text-[#102213] font-bold py-3 px-6 rounded-full shadow-lg shadow-[#13ec37]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPending ? "hourglass_empty" : "publish"}
                </span>
                {isPending ? "Publishing..." : "Publish Remedy"}
              </button>
              <Link
                href="/admin"
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
