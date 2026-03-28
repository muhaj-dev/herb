"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTeamMember(formData: {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  display_order?: number;
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await supabase
    .from("team_members")
    .insert({
      name: formData.name,
      role: formData.role || null,
      bio: formData.bio || null,
      image: formData.image || null,
      display_order: formData.display_order ?? 0,
    } as any)
    .select("id")
    .single()) as { data: { id: string } | null; error: any };

  if (error) {
    console.error("[createTeamMember] Supabase error:", error);
    return { error: error.message ?? "Failed to create team member." };
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  return data!;
}

export async function updateTeamMember(
  id: string,
  updates: {
    name?: string;
    role?: string;
    bio?: string;
    image?: string;
    display_order?: number;
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("team_members")
    .update(updates as any)
    .eq("id", id);

  if (error) {
    console.error("[updateTeamMember] Supabase error:", error);
    return { error: error.message ?? "Failed to update team member." };
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTeamMember(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    console.error("[deleteTeamMember] Supabase error:", error);
    return { error: error.message ?? "Failed to delete team member." };
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}
