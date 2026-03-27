import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/supabase/types";

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data as SiteSettings;
}
