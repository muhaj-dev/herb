"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ensureUniqueSlug } from "@/lib/slug";

export async function createRemedy(formData: {
  name: string;
  yoruba_name: string;
  yoruba_description: string;
  scientific_name?: string;
  type?: string;
  prep_time?: string;
  short_description?: string;
  disease_ids?: string[];
  preparation_steps?: string;
  ingredients?: { name: string; quantity: string }[];
  image?: string;
  video_url?: string;
  dosage?: string;
  duration?: string;
  precautions?: string;
  is_active: boolean;
  is_featured: boolean;
}): Promise<{ id: string } | { error: string }> {
  if (!formData.yoruba_name?.trim()) {
    return { error: "Yoruba name is required." };
  }
  if (!formData.yoruba_description?.trim()) {
    return { error: "Yoruba description is required." };
  }
  const supabase = await createClient();
  const slug = await ensureUniqueSlug(supabase, "remedies", formData.name);

  const { data: remedy, error } = await supabase
    .from("remedies")
    .insert({
      name: formData.name,
      yoruba_name: formData.yoruba_name.trim(),
      yoruba_description: formData.yoruba_description.trim(),
      slug,
      scientific_name: formData.scientific_name || null,
      type: formData.type || null,
      prep_time: formData.prep_time || null,
      short_description: formData.short_description || null,
      description: formData.short_description || null,
      preparation_steps: formData.preparation_steps || null,
      ingredients: formData.ingredients || [],
      image: formData.image || null,
      video_url: formData.video_url || null,
      dosage: formData.dosage || null,
      duration: formData.duration || null,
      precautions: formData.precautions || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (error) {
    console.error("[createRemedy] Supabase error:", error);
    return { error: error.message ?? "Failed to create remedy." };
  }

  if (formData.disease_ids?.length && remedy) {
    const links = formData.disease_ids.map((did) => ({
      disease_id: did,
      remedy_id: remedy.id,
      tag: null,
    }));
    const { error: linkError } = await supabase.from("disease_remedy").insert(links);
    if (linkError) console.error("[createRemedy] Disease link error:", linkError);
  }

  revalidatePath("/admin/remedies");
  revalidatePath("/admin");
  revalidatePath("/");
  return remedy!;
}

export async function updateRemedy(
  id: string,
  updates: {
    name?: string;
    yoruba_name?: string;
    yoruba_description?: string;
    scientific_name?: string;
    type?: string;
    prep_time?: string;
    short_description?: string;
    preparation_steps?: string;
    ingredients?: { name: string; quantity: string }[];
    image?: string | null;
    video_url?: string | null;
    dosage?: string;
    duration?: string;
    precautions?: string;
    is_active?: boolean;
    is_featured?: boolean;
  }
): Promise<{ success: true } | { error: string }> {
  if (updates.yoruba_name !== undefined && !updates.yoruba_name.trim()) {
    return { error: "Yoruba name cannot be empty." };
  }
  if (
    updates.yoruba_description !== undefined &&
    !updates.yoruba_description.trim()
  ) {
    return { error: "Yoruba description cannot be empty." };
  }
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.yoruba_name) updateData.yoruba_name = updates.yoruba_name.trim();
  if (updates.yoruba_description)
    updateData.yoruba_description = updates.yoruba_description.trim();
  if (updates.name) {
    updateData.slug = await ensureUniqueSlug(supabase, "remedies", updates.name, id);
  }
  if (updates.image !== undefined) {
    updateData.image = updates.image?.trim() ? updates.image.trim() : null;
  }
  if (updates.video_url !== undefined) {
    updateData.video_url = updates.video_url?.trim() ? updates.video_url.trim() : null;
  }

  const { error } = await supabase
    .from("remedies")
    .update(updateData as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    console.error("[updateRemedy] Supabase error:", error);
    return { error: error.message ?? "Failed to update remedy." };
  }

  revalidatePath("/admin/remedies");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function updateRemedyDiseases(
  remedyId: string,
  diseaseIds: string[]
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { error: delError } = await supabase
    .from("disease_remedy")
    .delete()
    .eq("remedy_id", remedyId);
  if (delError) {
    console.error("[updateRemedyDiseases] delete error:", delError);
    return { error: delError.message };
  }

  if (diseaseIds.length > 0) {
    const links = diseaseIds.map((did) => ({
      disease_id: did,
      remedy_id: remedyId,
      tag: null,
    }));
    const { error: insError } = await supabase
      .from("disease_remedy")
      .insert(links);
    if (insError) {
      console.error("[updateRemedyDiseases] insert error:", insError);
      return { error: insError.message };
    }
  }

  revalidatePath("/admin/remedies");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteRemedy(id: string): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("remedies").delete().eq("id", id);

  if (error) {
    console.error("[deleteRemedy] Supabase error:", error);
    return { error: error.message ?? "Failed to delete remedy." };
  }

  revalidatePath("/admin/remedies");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
