"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateRemedy,
  deleteRemedy,
  updateRemedyDiseases,
} from "@/lib/actions/remedy-actions";
import MediaUpload from "@/components/admin/MediaUpload";

type Ingredient = { name: string; quantity: string };

type RemedyData = {
  id: string;
  name: string;
  yoruba_name?: string | null;
  yoruba_description?: string | null;
  slug: string;
  scientific_name?: string | null;
  type?: string | null;
  image?: string | null;
  video_url?: string | null;
  description?: string | null;
  short_description?: string | null;
  dosage?: string | null;
  duration?: string | null;
  precautions?: string | null;
  preparation_steps?: string | null;
  ingredients?: Ingredient[] | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

type Disease = { id: string; name: string };

const inputCls =
  "w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RemedyDetailClient({
  remedy,
  diseases,
  linkedDiseaseIds,
}: {
  remedy: RemedyData;
  diseases: Disease[];
  linkedDiseaseIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialDraft = () => ({
    name: remedy.name,
    yoruba_name: remedy.yoruba_name ?? "",
    yoruba_description: remedy.yoruba_description ?? "",
    short_description: remedy.short_description ?? "",
    preparation_steps: remedy.preparation_steps ?? "",
    image: remedy.image ?? "",
    video_url: remedy.video_url ?? "",
    dosage: remedy.dosage ?? "",
    duration: remedy.duration ?? "",
    precautions: remedy.precautions ?? "",
    is_active: remedy.is_active,
    is_featured: remedy.is_featured,
    ingredients: (remedy.ingredients ?? []) as Ingredient[],
    disease_ids: [...linkedDiseaseIds],
  });

  const [draft, setDraft] = useState(initialDraft);
  const [diseaseQuery, setDiseaseQuery] = useState("");

  const startEdit = () => {
    setError(null);
    setDraft(initialDraft());
    setDiseaseQuery("");
    setEditing(true);
  };

  const toggleDisease = (id: string) =>
    setDraft((d) => ({
      ...d,
      disease_ids: d.disease_ids.includes(id)
        ? d.disease_ids.filter((x) => x !== id)
        : [...d.disease_ids, id],
    }));

  const cancelEdit = () => {
    setError(null);
    setEditing(false);
  };

  const saveEdit = () => {
    setError(null);
    if (!draft.name.trim()) return setError("Remedy name is required.");
    if (!draft.yoruba_name.trim()) return setError("Yoruba name is required.");
    if (!draft.yoruba_description.trim())
      return setError("Yoruba description is required.");
    startTransition(async () => {
      const result = await updateRemedy(remedy.id, {
        name: draft.name.trim(),
        yoruba_name: draft.yoruba_name.trim(),
        yoruba_description: draft.yoruba_description.trim(),
        short_description: draft.short_description.trim() || undefined,
        preparation_steps: draft.preparation_steps.trim() || undefined,
        image: draft.image.trim() ? draft.image.trim() : null,
        video_url: draft.video_url.trim() ? draft.video_url.trim() : null,
        dosage: draft.dosage.trim() || undefined,
        duration: draft.duration.trim() || undefined,
        precautions: draft.precautions.trim() || undefined,
        is_active: draft.is_active,
        is_featured: draft.is_featured,
        ingredients: draft.ingredients.filter((ig) => ig.name.trim()),
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      const diseaseResult = await updateRemedyDiseases(
        remedy.id,
        draft.disease_ids
      );
      if ("error" in diseaseResult) {
        setError(diseaseResult.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${remedy.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteRemedy(remedy.id);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin/remedies");
      }
    });
  };

  const addIngredient = () =>
    setDraft({ ...draft, ingredients: [...draft.ingredients, { name: "", quantity: "" }] });

  const removeIngredient = (i: number) =>
    setDraft({ ...draft, ingredients: draft.ingredients.filter((_, idx) => idx !== i) });

  const updateIngredient = (i: number, field: keyof Ingredient, value: string) => {
    const updated = [...draft.ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setDraft({ ...draft, ingredients: updated });
  };

  const current = editing ? draft : {
    name: remedy.name,
    short_description: remedy.short_description ?? "",
    preparation_steps: remedy.preparation_steps ?? "",
    dosage: remedy.dosage ?? "",
    duration: remedy.duration ?? "",
    precautions: remedy.precautions ?? "",
    is_active: remedy.is_active,
    is_featured: remedy.is_featured,
    ingredients: (remedy.ingredients ?? []) as Ingredient[],
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/remedies"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a3320] hover:bg-[#234829] text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <nav className="flex items-center">
            <Link href="/admin/remedies" className="text-sm font-medium text-slate-400 hover:text-white">
              Remedies
            </Link>
            <span className="material-symbols-outlined text-slate-600 mx-1">chevron_right</span>
            <span className="text-sm font-medium text-white">{current.name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {editing ? (
            <>
              <button onClick={cancelEdit} disabled={isPending} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={isPending} className="px-5 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 text-[#102213] text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#13ec37]/20">
                <span className="material-symbols-outlined text-[18px]">{isPending ? "hourglass_empty" : "save"}</span>
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 flex flex-col gap-4 sm:gap-8 max-w-[1200px] mx-auto w-full">
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── Hero Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-[#1a3320] border border-[#234829] flex items-center justify-center shrink-0 overflow-hidden relative">
              {remedy.image ? (
                <Image src={remedy.image} alt={remedy.name} fill sizes="96px" className="object-cover" />
              ) : (
                <span className="material-symbols-outlined text-2xl sm:text-4xl text-[#13ec37] z-10">local_florist</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                {editing ? (
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="text-xl sm:text-3xl font-bold text-white tracking-tight bg-transparent border-b-2 border-[#13ec37]/50 focus:border-[#13ec37] focus:outline-none pb-1"
                  />
                ) : (
                  <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">{current.name}</h2>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                  {current.is_active ? "Active" : "Inactive"}
                </span>
                {current.is_featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#13ec37]/10 text-[#13ec37] border border-[#13ec37]/20">
                    Featured
                  </span>
                )}
              </div>
              {!editing && remedy.yoruba_name && (
                <p className="text-[#13ec37] text-sm italic mt-1">
                  {remedy.yoruba_name}
                </p>
              )}
              {remedy.scientific_name && (
                <p className="text-slate-400 text-sm italic">{remedy.scientific_name}</p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                Created: {formatDate(remedy.created_at)} &bull; Type: {remedy.type ?? "—"}
              </p>
            </div>
          </div>
          {!editing && (
            <div className="flex gap-3">
              <button
                onClick={startEdit}
                className="px-5 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#102213] text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#13ec37]/20"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit Remedy
              </button>
            </div>
          )}
          {editing && (
            <div className="flex gap-3 lg:hidden">
              <button onClick={cancelEdit} disabled={isPending} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium border border-[#234829]">Cancel</button>
              <button onClick={saveEdit} disabled={isPending} className="px-5 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 text-[#102213] text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#13ec37]/20">
                <span className="material-symbols-outlined text-[18px]">{isPending ? "hourglass_empty" : "save"}</span>
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-8">
            {/* Basic Details (Yoruba) */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">
                  translate
                </span>
                Basic Details
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Yoruba Name {editing && <span className="text-red-400">*</span>}
                  </label>
                  {editing ? (
                    <input
                      className={inputCls}
                      placeholder="e.g. Ewé Igbálé"
                      value={draft.yoruba_name}
                      onChange={(e) =>
                        setDraft({ ...draft, yoruba_name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-slate-200 text-sm italic">
                      {remedy.yoruba_name || (
                        <span className="text-slate-500">—</span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Yoruba Description {editing && <span className="text-red-400">*</span>}
                  </label>
                  {editing ? (
                    <textarea
                      className={`${inputCls} resize-none min-h-[100px]`}
                      rows={3}
                      placeholder="Ṣàlàyé oògùn náà ní èdè Yorùbá..."
                      value={draft.yoruba_description}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          yoruba_description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-slate-300 text-sm italic leading-relaxed">
                      {remedy.yoruba_description || (
                        <span className="text-slate-500">—</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">description</span>
                Short Description
              </h3>
              {editing ? (
                <textarea
                  value={draft.short_description}
                  onChange={(e) => setDraft({ ...draft, short_description: e.target.value })}
                  className="w-full bg-[#112214] border border-[#234829] rounded-lg p-4 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[120px]"
                  placeholder="A brief overview of the remedy..."
                />
              ) : (
                <p className="text-slate-300 leading-relaxed text-sm">
                  {current.short_description || <span className="text-slate-500 italic">No description provided.</span>}
                </p>
              )}
            </div>

            {/* Preparation Steps */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">blender</span>
                Preparation Steps
              </h3>
              {editing ? (
                <div>
                  <textarea
                    value={draft.preparation_steps}
                    onChange={(e) => setDraft({ ...draft, preparation_steps: e.target.value })}
                    className="w-full bg-[#112214] border border-[#234829] rounded-lg p-4 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[200px]"
                    placeholder={"Step 1: ...\nStep 2: ..."}
                  />
                  <p className="text-xs text-slate-500 mt-2">One step per line.</p>
                </div>
              ) : current.preparation_steps ? (
                <ol className="space-y-3">
                  {current.preparation_steps.split("\n").filter(Boolean).map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-[#13ec37]/20 text-[#13ec37] font-bold text-xs">{i + 1}</span>
                      <span className="text-slate-300 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-500 text-sm italic">No preparation steps provided.</p>
              )}
            </div>

            {/* Ingredients */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec37]">grocery</span>
                  Ingredients
                </h3>
                {editing && (
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="text-xs text-[#13ec37] hover:text-white border border-[#13ec37]/30 hover:bg-[#13ec37]/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Add Row
                  </button>
                )}
              </div>
              {editing ? (
                <div className="space-y-3">
                  {draft.ingredients.map((ig, i) => (
                    <div key={i} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-5">
                        <input className={inputCls} placeholder="Ingredient" value={ig.name} onChange={(e) => updateIngredient(i, "name", e.target.value)} />
                      </div>
                      <div className="col-span-5">
                        <input className={inputCls} placeholder="Quantity" value={ig.quantity} onChange={(e) => updateIngredient(i, "quantity", e.target.value)} />
                      </div>
                      <div className="col-span-2 text-right">
                        <button type="button" onClick={() => removeIngredient(i)} className="text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-[#234829] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {draft.ingredients.length === 0 && (
                    <p className="text-slate-500 text-sm italic text-center py-2">No ingredients. Click &quot;Add Row&quot; to start.</p>
                  )}
                </div>
              ) : current.ingredients.length > 0 ? (
                <div className="space-y-2">
                  {current.ingredients.map((ig, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#234829]/30 border border-[#234829]">
                      <span className="text-slate-300 text-sm font-medium">{ig.name}</span>
                      <span className="text-slate-400 text-sm">{ig.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No ingredients listed.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Image */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37] text-[18px]">
                  image
                </span>
                Image
              </h4>
              {editing ? (
                <>
                  <MediaUpload
                    value={draft.image}
                    onChange={(url) => setDraft({ ...draft, image: url })}
                    accept="any"
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Video Link
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-[20px]">
                        play_circle
                      </span>
                      <input
                        className={`${inputCls} pl-10`}
                        placeholder="https://youtube.com/watch?v=..."
                        type="url"
                        value={draft.video_url}
                        onChange={(e) => setDraft({ ...draft, video_url: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Shown to users as a &quot;Watch video&quot; button under the image.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="aspect-video w-full rounded-lg bg-[#112214] border border-[#234829] overflow-hidden flex items-center justify-center relative">
                    {remedy.image ? (
                      <Image
                        src={remedy.image}
                        alt={remedy.name}
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-600">
                        <span className="material-symbols-outlined text-3xl">
                          image
                        </span>
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  {remedy.video_url && (
                    <a
                      href={remedy.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#102213] text-sm font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_circle</span>
                      Watch video
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Linked Diseases */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec37] text-[18px]">
                    coronavirus
                  </span>
                  Linked Diseases
                </h4>
                {editing && (
                  <span className="bg-[#13ec37]/10 text-[#13ec37] text-xs font-bold px-2 py-0.5 rounded-full">
                    {draft.disease_ids.length}
                  </span>
                )}
              </div>
              {editing ? (
                <>
                  {draft.disease_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {diseases
                        .filter((d) => draft.disease_ids.includes(d.id))
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
                    placeholder="Search diseases..."
                    value={diseaseQuery}
                    onChange={(e) => setDiseaseQuery(e.target.value)}
                    className={inputCls}
                  />
                  {(() => {
                    const filtered = diseases
                      .filter((d) => !draft.disease_ids.includes(d.id))
                      .filter((d) =>
                        diseaseQuery.trim()
                          ? d.name
                              .toLowerCase()
                              .includes(diseaseQuery.trim().toLowerCase())
                          : true
                      )
                      .slice(0, 8);
                    if (diseases.length === 0) {
                      return (
                        <p className="text-slate-500 text-xs mt-3">
                          No diseases in database yet.
                        </p>
                      );
                    }
                    if (filtered.length === 0) {
                      return (
                        <p className="text-slate-500 text-xs mt-3">
                          {diseaseQuery
                            ? "No matches."
                            : "All diseases linked."}
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
                              <span className="text-sm text-slate-200">
                                {d.name}
                              </span>
                              <span className="material-symbols-outlined text-[18px] text-slate-400">
                                add
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </>
              ) : linkedDiseaseIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {diseases
                    .filter((d) => linkedDiseaseIds.includes(d.id))
                    .map((d) => (
                      <span
                        key={d.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#234829] text-slate-200 rounded-full text-xs font-medium"
                      >
                        {d.name}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">
                  No diseases linked.
                </p>
              )}
            </div>

            {/* Usage & Dosage */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4">Usage & Dosage</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Dosage</label>
                  {editing ? (
                    <input className={inputCls} value={draft.dosage} onChange={(e) => setDraft({ ...draft, dosage: e.target.value })} placeholder="e.g. Twice daily after meals" />
                  ) : (
                    <p className="text-sm text-white">{current.dosage || <span className="text-slate-500 italic">—</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Duration</label>
                  {editing ? (
                    <input className={inputCls} value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="e.g. 2 weeks" />
                  ) : (
                    <p className="text-sm text-white">{current.duration || <span className="text-slate-500 italic">—</span>}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Precautions</label>
                  {editing ? (
                    <textarea className={`${inputCls} resize-none`} rows={3} value={draft.precautions} onChange={(e) => setDraft({ ...draft, precautions: e.target.value })} placeholder="One precaution per line" />
                  ) : current.precautions ? (
                    <ul className="space-y-1">
                      {current.precautions.split("\n").filter(Boolean).map((p, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="material-symbols-outlined text-amber-500 text-[14px] mt-0.5">warning</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">—</p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4">Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Active Status</p>
                    <p className="text-xs text-slate-400">Visible to users</p>
                  </div>
                  {editing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-[#234829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec37]" />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${current.is_active ? "bg-green-500" : "bg-yellow-500"}`} />
                      <span className="text-sm text-white">{current.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#234829]">
                  <div>
                    <p className="text-sm font-medium text-white">Featured</p>
                    <p className="text-xs text-slate-400">Show on homepage</p>
                  </div>
                  {editing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={draft.is_featured} onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-[#234829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec37]" />
                    </label>
                  ) : (
                    <span className="text-sm text-white">{current.is_featured ? "Yes" : "No"}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4">Actions</h4>
              <div className="flex flex-col gap-2">
                <Link href={`/remedies/${remedy.slug}`} className="w-full text-left px-3 py-2 rounded hover:bg-[#234829] text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">preview</span>
                  View on Public Site
                </Link>
                <div className="h-px bg-[#234829] my-1" />
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 rounded hover:bg-red-500/10 text-red-400 text-sm transition-colors flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete Remedy
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto py-6 text-center text-slate-500 text-sm border-t border-[#234829]">
          &copy; {new Date().getFullYear()} Herbal Admin Dashboard. All rights reserved.
        </footer>
      </div>
    </>
  );
}
