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
  scientific_name?: string;
  category: string;
  symptoms: string[];
  description: string;
  icon?: string;
  hero_image?: string;
  status: boolean;
  is_featured: boolean;
  remedy_ids?: string[];
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();

  const { data: disease, error } = await supabase
    .from("diseases")
    .insert({
      name: formData.name,
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

  revalidatePath("/admin/diseases");
  revalidatePath("/admin");
  return disease!;
}

export async function updateDisease(
  id: string,
  updates: {
    name?: string;
    category?: string;
    status?: string;
    severity?: number;
    severity_label?: string;
    description?: string[];
    symptoms?: string[];
    tags?: string[];
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
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
