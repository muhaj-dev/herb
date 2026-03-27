import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data ?? []) as Category[];
}
