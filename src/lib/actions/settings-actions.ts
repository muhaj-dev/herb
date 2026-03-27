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
) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("site_settings")
    .update(updates as any)
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/settings");
}
