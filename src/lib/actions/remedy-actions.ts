"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createRemedy(formData: {
  name: string;
  scientific_name?: string;
  type?: string;
  prep_time?: string;
  short_description?: string;
  disease_ids?: string[];
  preparation_steps?: string;
  ingredients?: { name: string; quantity: string }[];
  image?: string;
  dosage?: string;
  duration?: string;
  precautions?: string;
  is_active: boolean;
  is_featured: boolean;
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();

  const { data: remedy, error } = await supabase
    .from("remedies")
    .insert({
      name: formData.name,
      slug: slugify(formData.name),
      scientific_name: formData.scientific_name || null,
      type: formData.type || null,
      prep_time: formData.prep_time || null,
      short_description: formData.short_description || null,
      description: formData.short_description || null,
      preparation_steps: formData.preparation_steps || null,
      ingredients: formData.ingredients || [],
      image: formData.image || null,
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
    scientific_name?: string;
    type?: string;
    prep_time?: string;
    short_description?: string;
    preparation_steps?: string;
    ingredients?: { name: string; quantity: string }[];
    dosage?: string;
    duration?: string;
    precautions?: string;
    is_active?: boolean;
    is_featured?: boolean;
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.name) {
    updateData.slug = slugify(updates.name);
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
