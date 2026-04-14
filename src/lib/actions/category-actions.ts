"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: {
  name: string;
  yoruba_name: string;
  slug?: string;
  icon?: string;
  color?: string;
  display_order?: number;
}): Promise<{ id: string } | { error: string }> {
  if (!formData.yoruba_name?.trim()) {
    return { error: "Yoruba name is required." };
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: formData.name,
      yoruba_name: formData.yoruba_name.trim(),
      slug: formData.slug || slugify(formData.name),
      icon: formData.icon || null,
      color: formData.color || null,
      display_order: formData.display_order ?? 0,
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (error) {
    console.error("[createCategory] Supabase error:", error);
    return { error: error.message ?? "Failed to create category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return data!;
}

export async function updateCategory(
  id: string,
  updates: {
    name?: string;
    yoruba_name?: string;
    slug?: string;
    icon?: string;
    color?: string;
    display_order?: number;
  }
): Promise<{ success: true } | { error: string }> {
  if (updates.yoruba_name !== undefined && !updates.yoruba_name.trim()) {
    return { error: "Yoruba name cannot be empty." };
  }
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.yoruba_name) updateData.yoruba_name = updates.yoruba_name.trim();
  if (updates.name && !updates.slug) {
    updateData.slug = slugify(updates.name);
  }

  const { error } = await supabase
    .from("categories")
    .update(updateData as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    console.error("[updateCategory] Supabase error:", error);
    return { error: error.message ?? "Failed to update category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("[deleteCategory] Supabase error:", error);
    return { error: error.message ?? "Failed to delete category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}
