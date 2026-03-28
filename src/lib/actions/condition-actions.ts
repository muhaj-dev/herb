"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCondition(formData: {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  icon_bg?: string;
  badge_icon?: string;
  image?: string;
  safety_note?: string;
  safety_link?: string;
  category_id?: string;
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await supabase
    .from("conditions")
    .insert({
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      description: formData.description || null,
      icon: formData.icon || null,
      icon_bg: formData.icon_bg || null,
      badge_icon: formData.badge_icon || null,
      image: formData.image || null,
      safety_note: formData.safety_note || null,
      safety_link: formData.safety_link || null,
      category_id: formData.category_id || null,
    } as any)
    .select("id")
    .single()) as { data: { id: string } | null; error: any };

  if (error) {
    console.error("[createCondition] Supabase error:", error);
    return { error: error.message ?? "Failed to create condition." };
  }

  revalidatePath("/admin/conditions");
  revalidatePath("/");
  return data!;
}

export async function updateCondition(
  id: string,
  updates: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    icon_bg?: string;
    badge_icon?: string;
    image?: string;
    safety_note?: string;
    safety_link?: string;
    category_id?: string;
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...updates };
  if (updates.name && !updates.slug) {
    updateData.slug = slugify(updates.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("conditions")
    .update(updateData as any)
    .eq("id", id);

  if (error) {
    console.error("[updateCondition] Supabase error:", error);
    return { error: error.message ?? "Failed to update condition." };
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
