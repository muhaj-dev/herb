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
  slug?: string;
  icon?: string;
  color?: string;
  display_order?: number;
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await supabase
    .from("categories")
    .insert({
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      icon: formData.icon || null,
      color: formData.color || null,
      display_order: formData.display_order ?? 0,
    } as any)
    .select("id")
    .single()) as { data: { id: string } | null; error: any };

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
    slug?: string;
    icon?: string;
    color?: string;
    display_order?: number;
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.name && !updates.slug) {
    updateData.slug = slugify(updates.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("categories")
    .update(updateData as any)
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
