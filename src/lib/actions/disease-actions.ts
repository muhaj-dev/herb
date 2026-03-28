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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: disease, error } = (await supabase
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
    } as any)
    .select("id")
    .single()) as { data: { id: string } | null; error: any };

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: linkError } = await supabase.from("disease_remedy").insert(links as any);
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
) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.name) {
    updateData.slug = slugify(updates.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("diseases")
    .update(updateData as any)
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/diseases");
  revalidatePath(`/admin/diseases/${id}`);
  revalidatePath("/admin");
}

export async function updateDiseaseRemedies(
  diseaseId: string,
  remedyIds: string[]
) {
  const supabase = await createClient();

  // Remove all existing links
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: deleteError } = await supabase
    .from("disease_remedy")
    .delete()
    .eq("disease_id", diseaseId);
  if (deleteError) throw deleteError;

  // Insert new links
  if (remedyIds.length > 0) {
    const links = remedyIds.map((rid) => ({
      disease_id: diseaseId,
      remedy_id: rid,
      tag: null,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await supabase
      .from("disease_remedy")
      .insert(links as any);
    if (insertError) throw insertError;
  }

  revalidatePath("/admin/diseases");
  revalidatePath(`/admin/diseases`);
  revalidatePath("/admin");
}

export async function deleteDisease(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("diseases").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/diseases");
  revalidatePath("/admin");
}
