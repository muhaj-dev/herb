"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createDisease(formData: {
  name: string;
  yoruba_name: string;
  yoruba_description: string;
  scientific_name?: string;
  category: string;
  symptoms: string[];
  description: string;
  icon?: string;
  hero_image?: string;
  status: boolean;
  is_featured: boolean;
  remedy_ids?: string[];
  condition_ids?: string[];
}): Promise<{ id: string } | { error: string }> {
  if (!formData.yoruba_name?.trim()) {
    return { error: "Yoruba name is required." };
  }
  if (!formData.yoruba_description?.trim()) {
    return { error: "Yoruba description is required." };
  }
  if (!formData.condition_ids || formData.condition_ids.length === 0) {
    return { error: "A disease must be linked to at least one condition." };
  }
  const supabase = await createClient();

  const { data: disease, error } = await supabase
    .from("diseases")
    .insert({
      name: formData.name,
      yoruba_name: formData.yoruba_name.trim(),
      yoruba_description: formData.yoruba_description.trim(),
      slug: slugify(formData.name),
      scientific_name: formData.scientific_name || null,
      category: formData.category,
      symptoms: formData.symptoms,
      description: formData.description
        ? formData.description.split("\n\n").filter(Boolean)
        : [],
      icon: formData.icon || null,
      hero_image: formData.hero_image || null,
      status: formData.status ? "Active" : "Draft",
      is_featured: formData.is_featured,
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (error) {
    console.error("[createDisease] Supabase error:", error);
    return { error: error.message ?? "Failed to create disease." };
  }

  if (formData.remedy_ids?.length && disease) {
    const links = formData.remedy_ids.map((rid) => ({
      disease_id: disease.id,
      remedy_id: rid,
      tag: null,
    }));
    const { error: linkError } = await supabase.from("disease_remedy").insert(links);
    if (linkError) console.error("[createDisease] Remedy link error:", linkError);
  }

  if (disease && formData.condition_ids && formData.condition_ids.length > 0) {
    const condLinks = formData.condition_ids.map((cid) => ({
      condition_id: cid,
      disease_id: disease.id,
    }));
    const { error: condError } = await supabase
      .from("condition_diseases")
      .insert(condLinks);
    if (condError) {
      console.error("[createDisease] Condition link error:", condError);
      return { error: condError.message ?? "Failed to link conditions." };
    }
  }

  revalidatePath("/admin/diseases");
  revalidatePath("/admin/conditions");
  revalidatePath("/admin");
  return disease!;
}

export async function updateDiseaseConditions(
  diseaseId: string,
  conditionIds: string[]
): Promise<{ success: true } | { error: string }> {
  if (conditionIds.length === 0) {
    return { error: "A disease must be linked to at least one condition." };
  }
  const supabase = await createClient();

  const { error: delError } = await supabase
    .from("condition_diseases")
    .delete()
    .eq("disease_id", diseaseId);
  if (delError) return { error: delError.message };

  const rows = conditionIds.map((condition_id) => ({
    condition_id,
    disease_id: diseaseId,
  }));
  const { error: insError } = await supabase
    .from("condition_diseases")
    .insert(rows);
  if (insError) return { error: insError.message };

  revalidatePath("/admin/diseases");
  revalidatePath("/admin/conditions");
  return { success: true };
}

export async function updateDisease(
  id: string,
  updates: {
    name?: string;
    yoruba_name?: string;
    yoruba_description?: string;
    category?: string;
    status?: string;
    severity?: number;
    severity_label?: string;
    description?: string[];
    symptoms?: string[];
    tags?: string[];
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
    updateData.slug = slugify(updates.name);
  }

  const { error } = await supabase
    .from("diseases")
    .update(updateData as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    return { error: error.message ?? "Failed to update disease." };
  }

  revalidatePath("/admin/diseases");
  revalidatePath(`/admin/diseases/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function updateDiseaseRemedies(
  diseaseId: string,
  remedyIds: string[]
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("disease_remedy")
    .delete()
    .eq("disease_id", diseaseId);
  if (deleteError) {
    return { error: deleteError.message ?? "Failed to update remedy links." };
  }

  if (remedyIds.length > 0) {
    const links = remedyIds.map((rid) => ({
      disease_id: diseaseId,
      remedy_id: rid,
      tag: null,
    }));
    const { error: insertError } = await supabase
      .from("disease_remedy")
      .insert(links);
    if (insertError) {
      return { error: insertError.message ?? "Failed to link remedies." };
    }
  }

  revalidatePath("/admin/diseases");
  revalidatePath(`/admin/diseases`);
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteDisease(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("diseases").delete().eq("id", id);

  if (error) {
    return { error: error.message ?? "Failed to delete disease." };
  }

  revalidatePath("/admin/diseases");
  revalidatePath("/admin");
  return { success: true };
}
