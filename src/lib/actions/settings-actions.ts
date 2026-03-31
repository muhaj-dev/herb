"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(
  id: string,
  updates: {
    site_name?: string;
    tagline?: string;
    support_email?: string;
    phone?: string;
    emergency_contact?: string;
    address?: string;
    currency?: string;
    timezone?: string;
  }
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update(updates as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    return { error: error.message ?? "Failed to update settings." };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
