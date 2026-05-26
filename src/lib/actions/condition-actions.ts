"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ensureUniqueSlug } from "@/lib/slug";

type ConditionInput = {
  name: string;
  yoruba_name?: string;
  yoruba_description?: string;
  slug?: string;
  description?: string;
  icon?: string;
  icon_bg?: string;
  badge_icon?: string;
  image?: string;
  safety_note?: string;
  safety_link?: string;
  category_id?: string;
  disease_ids?: string[];
};

async function syncConditionDiseases(
  conditionId: string,
  diseaseIds: string[]
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error: delError } = await supabase
    .from("condition_diseases")
    .delete()
    .eq("condition_id", conditionId);
  if (delError) return { error: delError.message };

  if (diseaseIds.length === 0) return {};

  const rows = diseaseIds.map((disease_id) => ({
    condition_id: conditionId,
    disease_id,
  }));
  const { error: insError } = await supabase
    .from("condition_diseases")
    .insert(rows);
  if (insError) return { error: insError.message };
  return {};
}

export async function createCondition(
  formData: ConditionInput
): Promise<{ id: string } | { error: string }> {
  if (!formData.yoruba_name?.trim()) {
    return { error: "Yoruba name is required." };
  }
  if (!formData.yoruba_description?.trim()) {
    return { error: "Yoruba description is required." };
  }
  const supabase = await createClient();
  const slug = await ensureUniqueSlug(
    supabase,
    "conditions",
    formData.slug || formData.name
  );

  const { data, error } = await supabase
    .from("conditions")
    .insert({
      name: formData.name,
      yoruba_name: formData.yoruba_name.trim(),
      yoruba_description: formData.yoruba_description.trim(),
      slug,
      description: formData.description || null,
      icon: formData.icon || null,
      icon_bg: formData.icon_bg || null,
      badge_icon: formData.badge_icon || null,
      image: formData.image || null,
      safety_note: formData.safety_note || null,
      safety_link: formData.safety_link || null,
      category_id: formData.category_id || null,
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (error) {
    console.error("[createCondition] Supabase error:", error);
    return { error: error.message ?? "Failed to create condition." };
  }

  if (formData.disease_ids && formData.disease_ids.length > 0) {
    const syncRes = await syncConditionDiseases(data!.id, formData.disease_ids);
    if (syncRes.error) {
      console.error("[createCondition] disease link error:", syncRes.error);
      return { error: syncRes.error };
    }
  }

  revalidatePath("/admin/conditions");
  revalidatePath("/");
  return data!;
}

export async function updateCondition(
  id: string,
  updates: Partial<ConditionInput>
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

  const { disease_ids, ...fields } = updates;
  const updateData: Record<string, unknown> = { ...fields };
  if (updates.yoruba_name) updateData.yoruba_name = updates.yoruba_name.trim();
  if (updates.yoruba_description)
    updateData.yoruba_description = updates.yoruba_description.trim();
  if ((updates.name && !updates.slug) || updates.slug) {
    updateData.slug = await ensureUniqueSlug(
      supabase,
      "conditions",
      updates.slug || updates.name!,
      id
    );
  }

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("conditions")
      .update(updateData as Record<string, unknown>)
      .eq("id", id);

    if (error) {
      console.error("[updateCondition] Supabase error:", error);
      return { error: error.message ?? "Failed to update condition." };
    }
  }

  if (disease_ids !== undefined) {
    const syncRes = await syncConditionDiseases(id, disease_ids);
    if (syncRes.error) {
      console.error("[updateCondition] disease link error:", syncRes.error);
      return { error: syncRes.error };
    }
  }

  revalidatePath("/admin/conditions");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCondition(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("conditions").delete().eq("id", id);

  if (error) {
    console.error("[deleteCondition] Supabase error:", error);
    return { error: error.message ?? "Failed to delete condition." };
  }

  revalidatePath("/admin/conditions");
  revalidatePath("/");
  return { success: true };
}
