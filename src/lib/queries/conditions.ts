import { createClient } from "@/lib/supabase/server";
import type { Condition } from "@/lib/supabase/types";

export async function getConditions(): Promise<Condition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conditions")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Condition[];
}

export async function getConditionBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conditions")
    .select(
      `*,
      condition_remedy (
        display_order,
        icons,
        remedy:remedies (*)
      )`
    )
    .eq("slug", slug)
    .single();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
}
