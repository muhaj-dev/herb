"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateDisease,
  updateDiseaseRemedies,
  updateDiseaseConditions,
  deleteDisease,
} from "@/lib/actions/disease-actions";
import MediaUpload from "@/components/admin/MediaUpload";

const categoryOptions = [
  "respiratory",
  "digestive",
  "nervous",
  "cardiovascular",
  "skin",
  "musculoskeletal",
];

const inputCls =
  "w-full bg-[#112214] border border-[#234829] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm";

type Remedy = {
  id: string;
  name: string;
  slug: string;
  scientific_name?: string | null;
  short_description?: string | null;
  image?: string | null;
};

type Disease = {
  id: string;
  name: string;
  yoruba_name?: string | null;
  yoruba_description?: string | null;
  slug: string;
  scientific_name?: string | null;
  icon?: string | null;
  hero_image?: string | null;
  video_url?: string | null;
  status: string;
  category?: string | null;
  severity?: number | null;
  severity_label?: string | null;
  description?: string[] | null;
  symptoms?: string[] | null;
  tags?: string[] | null;
  views_count?: number | null;
  saves_count?: number | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  disease_remedy?: { tag?: string | null; remedy: Remedy }[];
};

type RemedyOption = { id: string; name: string; type?: string | null };
type ConditionOption = { id: string; name: string };

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DiseaseDetailClient({
  disease,
  allRemedies,
  allConditions,
  linkedConditionIds,
}: {
  disease: Disease;
  allRemedies: RemedyOption[];
  allConditions: ConditionOption[];
  linkedConditionIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    name: disease.name,
    yoruba_name: disease.yoruba_name ?? "",
    yoruba_description: disease.yoruba_description ?? "",
    category: disease.category ?? "",
    status: disease.status,
    severity: disease.severity ?? 0,
    severity_label: disease.severity_label ?? "Low",
    description: disease.description ?? [],
    symptoms: disease.symptoms ?? [],
    tags: disease.tags ?? [],
    hero_image: disease.hero_image ?? "",
    video_url: disease.video_url ?? "",
  });
  const [selectedConditionIds, setSelectedConditionIds] =
    useState<string[]>(linkedConditionIds);
  const [conditionQuery, setConditionQuery] = useState("");

  const selectedConditions = allConditions.filter((c) =>
    selectedConditionIds.includes(c.id)
  );
  const filteredConditions = allConditions
    .filter((c) => !selectedConditionIds.includes(c.id))
    .filter((c) =>
      conditionQuery.trim()
        ? c.name.toLowerCase().includes(conditionQuery.trim().toLowerCase())
        : true
    )
    .slice(0, 8);
  const toggleCondition = (id: string) =>
    setSelectedConditionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const [newSymptom, setNewSymptom] = useState("");
  const [selectedRemedyIds, setSelectedRemedyIds] = useState<string[]>(
    disease.disease_remedy?.map((dr) => dr.remedy.id).filter(Boolean) ?? []
  );
  const [remedySearch, setRemedySearch] = useState("");

  const toggleRemedy = (id: string) =>
    setSelectedRemedyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const startEdit = () => {
    setError(null);
    setDraft({
      name: disease.name,
      yoruba_name: disease.yoruba_name ?? "",
      yoruba_description: disease.yoruba_description ?? "",
      category: disease.category ?? "",
      status: disease.status,
      severity: disease.severity ?? 0,
      severity_label: disease.severity_label ?? "Low",
      description: disease.description ?? [],
      symptoms: disease.symptoms ?? [],
      tags: disease.tags ?? [],
      hero_image: disease.hero_image ?? "",
      video_url: disease.video_url ?? "",
    });
    setSelectedRemedyIds(
      disease.disease_remedy?.map((dr) => dr.remedy.id).filter(Boolean) ?? []
    );
    setRemedySearch("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setError(null);
    setEditing(false);
  };

  const saveEdit = () => {
    setError(null);
    if (!draft.yoruba_name.trim())
      return setError("Yoruba name is required.");
    if (!draft.yoruba_description.trim())
      return setError("Yoruba description is required.");
    if (selectedConditionIds.length === 0)
      return setError("A disease must be linked to at least one condition.");
    startTransition(async () => {
      try {
        const res = await updateDisease(disease.id, {
          name: draft.name,
          yoruba_name: draft.yoruba_name.trim(),
          yoruba_description: draft.yoruba_description.trim(),
          category: draft.category,
          status: draft.status,
          severity: draft.severity,
          severity_label: draft.severity_label,
          description: draft.description,
          symptoms: draft.symptoms,
          tags: draft.tags,
          hero_image: draft.hero_image,
          video_url: draft.video_url,
        });
        if ("error" in res) {
          setError(res.error);
          return;
        }
        await updateDiseaseRemedies(disease.id, selectedRemedyIds);
        const condRes = await updateDiseaseConditions(
          disease.id,
          selectedConditionIds
        );
        if ("error" in condRes) {
          setError(condRes.error);
          return;
        }
        setEditing(false);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to save changes.");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${disease.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteDisease(disease.id);
        router.push("/admin/diseases");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to delete disease.");
      }
    });
  };

  const addSymptom = () => {
    if (newSymptom.trim()) {
      setDraft({ ...draft, symptoms: [...draft.symptoms, newSymptom.trim()] });
      setNewSymptom("");
    }
  };

  const removeSymptom = (i: number) =>
    setDraft({ ...draft, symptoms: draft.symptoms.filter((_, idx) => idx !== i) });

  const addTag = (tag: string) => {
    if (tag.trim() && !draft.tags.includes(tag.trim()))
      setDraft({ ...draft, tags: [...draft.tags, tag.trim()] });
  };

  const removeTag = (i: number) =>
    setDraft({ ...draft, tags: draft.tags.filter((_, idx) => idx !== i) });

  const current = editing ? draft : {
    name: disease.name,
    category: disease.category ?? "",
    status: disease.status,
    severity: disease.severity ?? 0,
    severity_label: disease.severity_label ?? "Low",
    description: disease.description ?? [],
    symptoms: disease.symptoms ?? [],
    tags: disease.tags ?? [],
  };

  const linkedRemedies =
    disease.disease_remedy?.map((dr) => dr.remedy).filter(Boolean) ?? [];

  // While editing, the banner reflects the draft image so changes preview live.
  const heroImageSrc = editing ? draft.hero_image : disease.hero_image;

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/diseases"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a3320] hover:bg-[#234829] text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <nav className="flex items-center">
            <Link href="/admin/diseases" className="text-sm font-medium text-slate-400 hover:text-white">
              Diseases
            </Link>
            <span className="material-symbols-outlined text-slate-600 mx-1">chevron_right</span>
            <span className="text-sm font-medium text-white">{current.name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={isPending}
                className="px-5 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 text-[#102213] text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#13ec37]/20"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPending ? "hourglass_empty" : "save"}
                </span>
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-[#13ec37] transition-colors text-[20px]">search</span>
              <input className="bg-[#1a3320] border border-[#234829] text-sm rounded-full pl-10 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13ec37]/50 focus:border-[#13ec37] w-64 transition-all" placeholder="Search database..." type="text" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 flex flex-col gap-4 sm:gap-8 max-w-[1200px] mx-auto w-full">
        {/* Mobile error */}
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── Hero Banner ── */}
        <div className="relative w-full h-52 sm:h-72 lg:h-[22rem] rounded-2xl overflow-hidden border border-[#234829] bg-[#1a3320] group/hero">
          {heroImageSrc ? (
            <Image
              src={heroImageSrc}
              alt={current.name}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition-transform duration-700 ease-out group-hover/hero:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a3320] via-[#14271a] to-[#0d1b10]">
              <span className="material-symbols-outlined text-7xl text-[#13ec37]/30">
                {disease.icon ?? "local_hospital"}
              </span>
            </div>
          )}

          {/* Legibility scrim — keeps overlaid text readable on any image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a160d] via-[#0a160d]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a160d]/40 to-transparent" />

          {/* Top-right actions float over the banner */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 sm:gap-3">
            {!editing ? (
              <>
                <button className="px-3 sm:px-4 py-2 rounded-lg bg-[#102213]/70 backdrop-blur-sm hover:bg-[#1a3320] text-slate-200 hover:text-white text-sm font-medium transition-colors border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span className="hidden sm:inline">History</span>
                </button>
                <button
                  onClick={startEdit}
                  className="px-4 sm:px-5 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#102213] text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#13ec37]/20"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span className="hidden sm:inline">Edit Entry</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2 lg:hidden">
                <button onClick={cancelEdit} disabled={isPending} className="px-4 py-2 rounded-lg bg-[#102213]/70 backdrop-blur-sm text-slate-200 hover:text-white text-sm font-medium border border-white/10">
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={isPending} className="px-5 py-2 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 disabled:opacity-50 text-[#102213] text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#13ec37]/20">
                  <span className="material-symbols-outlined text-[18px]">{isPending ? "hourglass_empty" : "save"}</span>
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {/* Category + icon chip, top-left */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#102213]/70 backdrop-blur-sm border border-white/10 text-[#13ec37]">
              <span className="material-symbols-outlined text-[20px]">{disease.icon ?? "local_hospital"}</span>
            </span>
            {current.category && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#102213]/70 backdrop-blur-sm border border-white/10 text-slate-200 capitalize">
                {current.category}
              </span>
            )}
          </div>

          {/* Title + meta overlaid at the bottom */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
              {editing ? (
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="text-2xl sm:text-4xl font-bold text-white tracking-tight bg-[#102213]/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10 focus:border-[#13ec37] focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  {current.name}
                </h2>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30 backdrop-blur-sm">
                {current.status}
              </span>
            </div>

            {editing ? (
              <div className="space-y-2 mt-2 max-w-xl">
                <input
                  value={draft.yoruba_name}
                  placeholder="Yoruba name (required)"
                  onChange={(e) => setDraft({ ...draft, yoruba_name: e.target.value })}
                  className="w-full bg-[#102213]/70 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm italic"
                />
                <textarea
                  value={draft.yoruba_description}
                  placeholder="Yoruba description (required)"
                  rows={2}
                  onChange={(e) => setDraft({ ...draft, yoruba_description: e.target.value })}
                  className="w-full bg-[#102213]/70 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm italic resize-none"
                />
              </div>
            ) : (
              disease.yoruba_name && (
                <p className="text-[#13ec37] text-sm sm:text-base italic drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  {disease.yoruba_name}
                </p>
              )
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 sm:mt-3">
              <p className="text-slate-300 text-xs sm:text-sm">
                ID: {disease.id.slice(0, 8).toUpperCase()} &bull; Created: {formatDate(disease.created_at)}
              </p>
              <span className="hidden sm:block w-px h-3 bg-white/20" />
              <div className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                {disease.views_count ?? 0} Views
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
                <span className="material-symbols-outlined text-[16px]">bookmark</span>
                {disease.saves_count ?? 0} Saves
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero Image editor (edit mode only) ── */}
        {editing && (
          <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#13ec37]">image</span>
              Hero Image
            </h3>
            <MediaUpload
              value={draft.hero_image}
              onChange={(url) => setDraft({ ...draft, hero_image: url })}
              accept="image"
              placeholder="https://example.com/image.jpg"
            />

            <div className="mt-4">
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                Video Link
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-[20px]">
                  play_circle
                </span>
                <input
                  className="w-full bg-[#112214] border border-[#234829] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                  type="url"
                  value={draft.video_url}
                  onChange={(e) => setDraft({ ...draft, video_url: e.target.value })}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Optional. Shown to users as a &quot;Watch video&quot; button under the image.
              </p>
            </div>
          </div>
        )}

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-8">
            {/* Description */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#13ec37]">description</span>
                Description
              </h3>
              {editing ? (
                <textarea
                  value={draft.description.join("\n\n")}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value.split("\n\n") })}
                  className="w-full bg-[#112214] border border-[#234829] rounded-lg p-4 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-all min-h-[200px]"
                />
              ) : current.description.length > 0 ? (
                <div className="text-slate-300 leading-relaxed text-sm space-y-4">
                  {current.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No description provided.</p>
              )}
            </div>

            {/* Symptoms */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">sick</span>
                Symptoms
              </h3>
              {editing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {draft.symptoms.map((symptom, i) => (
                      <span key={i} className="bg-[#234829] text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#234829]">
                        {symptom}
                        <button onClick={() => removeSymptom(i)} className="hover:text-red-400 transition-colors" type="button">
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSymptom(); } }}
                      className={inputCls}
                      placeholder="Type a symptom and press Enter..."
                    />
                    <button onClick={addSymptom} className="px-3 py-2 bg-[#234829] hover:bg-[#13ec37]/20 text-[#13ec37] rounded-lg transition-colors shrink-0" type="button">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
              ) : current.symptoms.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {current.symptoms.map((symptom) => (
                    <li key={symptom} className="flex items-start gap-3 p-3 rounded-lg bg-[#234829]/30 border border-[#234829]">
                      <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">circle</span>
                      <span className="text-slate-300 text-sm">{symptom}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm italic">No symptoms listed.</p>
              )}
            </div>

            {/* Linked Conditions (required) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec37]">
                    health_and_safety
                  </span>
                  Conditions{" "}
                  {editing && <span className="text-red-400">*</span>}
                </h3>
                {editing && (
                  <span className="bg-[#13ec37]/10 text-[#13ec37] text-xs font-bold px-2 py-1 rounded-full">
                    {selectedConditionIds.length} Selected
                  </span>
                )}
              </div>

              {editing ? (
                <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
                  {selectedConditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedConditions.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCondition(c.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#13ec37]/15 border border-[#13ec37]/40 text-[#13ec37] rounded-full text-xs font-medium hover:bg-[#13ec37]/25 transition-colors"
                        >
                          {c.name}
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search conditions to link..."
                    value={conditionQuery}
                    onChange={(e) => setConditionQuery(e.target.value)}
                    className={inputCls}
                  />
                  {allConditions.length === 0 ? (
                    <p className="text-slate-500 text-xs mt-3">
                      No conditions exist yet.
                    </p>
                  ) : filteredConditions.length === 0 ? (
                    <p className="text-slate-500 text-xs mt-3">
                      {conditionQuery
                        ? "No matches."
                        : "All conditions linked."}
                    </p>
                  ) : (
                    <ul className="mt-3 flex flex-col gap-1 max-h-56 overflow-y-auto">
                      {filteredConditions.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => toggleCondition(c.id)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#234829]/50 text-left transition-colors"
                          >
                            <span className="text-sm text-slate-200">
                              {c.name}
                            </span>
                            <span className="material-symbols-outlined text-[18px] text-slate-400">
                              add
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : selectedConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedConditions.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center px-3 py-1.5 bg-[#13ec37]/10 border border-[#13ec37]/30 text-[#13ec37] rounded-full text-xs font-medium"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">
                  Not linked to any conditions yet. Click Edit to fix.
                </p>
              )}
            </div>

            {/* Linked Remedies */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec37]">medication_liquid</span>
                  Linked Remedies
                </h3>
                {editing && (
                  <span className="bg-[#13ec37]/10 text-[#13ec37] text-xs font-bold px-2 py-1 rounded-full">
                    {selectedRemedyIds.length} Selected
                  </span>
                )}
              </div>

              {editing ? (
                <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-6">
                  {/* Search */}
                  <div className="relative group mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-[#13ec37] transition-colors text-[20px]">
                      search
                    </span>
                    <input
                      className="w-full bg-[#112214] border border-[#234829] text-sm rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#13ec37] focus:border-[#13ec37] transition-all"
                      placeholder="Search remedies..."
                      type="text"
                      value={remedySearch}
                      onChange={(e) => setRemedySearch(e.target.value)}
                    />
                  </div>

                  {/* Selected remedies */}
                  {selectedRemedyIds.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Selected</p>
                      {allRemedies
                        .filter((r) => selectedRemedyIds.includes(r.id))
                        .map((remedy) => (
                          <div key={remedy.id} className="flex items-center justify-between bg-[#112214] p-3 rounded-lg border border-[#13ec37]/30">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#234829] flex items-center justify-center text-[#13ec37]">
                                <span className="material-symbols-outlined text-lg">spa</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{remedy.name}</p>
                                <p className="text-xs text-slate-400">{remedy.type ?? "Herbal"}</p>
                              </div>
                            </div>
                            <button
                              className="text-slate-500 hover:text-red-400 transition-colors"
                              type="button"
                              onClick={() => toggleRemedy(remedy.id)}
                            >
                              <span className="material-symbols-outlined">remove_circle</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  )}

                  {selectedRemedyIds.length > 0 && <div className="h-px bg-[#234829] w-full my-4" />}

                  {/* Available remedies */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {remedySearch ? "Search Results" : "Available Remedies"}
                    </p>
                    {allRemedies
                      .filter(
                        (r) =>
                          !selectedRemedyIds.includes(r.id) &&
                          r.name.toLowerCase().includes(remedySearch.toLowerCase())
                      )
                      .map((remedy) => (
                        <div
                          key={remedy.id}
                          className="flex items-center justify-between p-2 hover:bg-[#112214] rounded-lg transition-colors cursor-pointer group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#234829] group-hover/item:bg-[#1a3320] text-slate-400 group-hover/item:text-slate-200 flex items-center justify-center">
                              <span className="material-symbols-outlined text-lg">local_florist</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-300 group-hover/item:text-white">{remedy.name}</p>
                              <p className="text-xs text-slate-500">{remedy.type ?? "Herbal"}</p>
                            </div>
                          </div>
                          <button
                            className="text-slate-500 hover:text-[#13ec37] transition-colors"
                            type="button"
                            onClick={() => toggleRemedy(remedy.id)}
                          >
                            <span className="material-symbols-outlined">add_circle</span>
                          </button>
                        </div>
                      ))}
                    {allRemedies.filter(
                      (r) =>
                        !selectedRemedyIds.includes(r.id) &&
                        r.name.toLowerCase().includes(remedySearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">
                        {remedySearch ? "No remedies found" : "All remedies selected"}
                      </p>
                    )}
                  </div>
                </div>
              ) : linkedRemedies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {linkedRemedies.map((remedy) => (
                    <div key={remedy.id} className="bg-[#1a3320] border border-[#234829] rounded-xl p-3 flex gap-4 hover:border-[#13ec37]/40 transition-all cursor-pointer group">
                      <div className="w-16 h-16 rounded-lg bg-[#234829] overflow-hidden relative shrink-0">
                        {remedy.image ? (
                          <Image src={remedy.image} alt={remedy.name} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <span className="material-symbols-outlined text-slate-500">image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h4 className="font-bold text-white text-base group-hover:text-[#13ec37] transition-colors">{remedy.name}</h4>
                        {remedy.scientific_name && (
                          <p className="text-xs text-slate-500 italic">{remedy.scientific_name}</p>
                        )}
                        {remedy.short_description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{remedy.short_description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No remedies linked yet.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Metadata */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4">Metadata</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Status</label>
                  {editing ? (
                    <select
                      value={draft.status}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                      className="bg-[#112214] border border-[#234829] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] appearance-none w-full"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${current.status === "Active" ? "bg-green-500" : current.status === "Draft" ? "bg-yellow-500" : "bg-slate-500"}`} />
                      <span className="text-sm text-white font-medium">{current.status}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Creation Date</label>
                  <span className="text-sm text-white font-mono">{formatDate(disease.created_at)}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Category</label>
                  {editing ? (
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="bg-[#112214] border border-[#234829] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] appearance-none w-full"
                    >
                      <option value="">— Select —</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-white bg-[#234829] px-2 py-1 rounded">{current.category || "—"}</span>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Severity Level</label>
                  {editing ? (
                    <div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={draft.severity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setDraft({
                            ...draft,
                            severity: val,
                            severity_label: val < 30 ? "Low" : val < 60 ? "Moderate" : "Severe",
                          });
                        }}
                        className="w-full accent-[#13ec37]"
                      />
                      <span className="text-xs text-yellow-500 mt-1 block">{draft.severity_label} ({draft.severity}%)</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${current.severity}%` }} />
                      </div>
                      <span className="text-xs text-yellow-500 mt-1 block">
                        {current.severity_label || "—"} ({current.severity}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {current.tags.map((tag, i) => (
                  <span key={tag} className="text-xs bg-[#234829] text-slate-300 px-3 py-1.5 rounded-full border border-[#234829] hover:border-[#13ec37]/50 cursor-pointer transition-colors flex items-center gap-1">
                    {tag}
                    {editing && (
                      <button onClick={() => removeTag(i)} className="hover:text-red-400" type="button">
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    )}
                  </span>
                ))}
                {current.tags.length === 0 && !editing && (
                  <span className="text-slate-500 text-sm italic">No tags.</span>
                )}
              </div>
              {editing && (
                <input
                  className={`${inputCls} mt-3`}
                  placeholder="Add tag and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              )}
            </div>

            {/* Actions */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 sm:mb-4">Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-[#234829] text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Share Internal Link
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-[#234829] text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">preview</span>
                  Preview on Live Site
                </button>
                <div className="h-px bg-[#234829] my-1" />
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 rounded hover:bg-red-500/10 text-red-400 text-sm transition-colors flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete Disease
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
