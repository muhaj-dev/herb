import { createClient } from "@/lib/supabase/server";
import type { Condition, Remedy } from "@/lib/supabase/types";

type ConditionWithRemedies = Condition & {
  condition_remedy: {
    display_order: number;
    icons: { icon: string; title: string }[];
    remedy: Remedy;
  }[];
};

export async function getConditions(): Promise<Condition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conditions")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Condition[];
}

export async function getConditionBySlug(slug: string): Promise<ConditionWithRemedies> {
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
  return data as ConditionWithRemedies;
}
