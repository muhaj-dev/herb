import { createClient } from "@/lib/supabase/server";
import type { Condition, Disease, Remedy } from "@/lib/supabase/types";

type ConditionWithRemedies = Condition & {
  condition_remedy: {
    display_order: number;
    icons: { icon: string; title: string }[];
    remedy: Remedy;
  }[];
  condition_diseases?: {
    disease: Pick<
      Disease,
      "id" | "name" | "slug" | "icon" | "severity" | "severity_label" | "status"
    >;
  }[];
};

export type ConditionWithCounts = Condition & { disease_count: number };

export async function getConditions(): Promise<ConditionWithCounts[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conditions")
    .select("*, condition_diseases(count)")
    .order("name");
  if (error) throw new Error(`[conditions] ${error.code ?? ""} ${error.message} ${error.details ?? ""} ${error.hint ?? ""}`);
  return (data ?? []).map((row) => {
    const { condition_diseases, ...rest } = row as Condition & {
      condition_diseases?: { count: number }[];
    };
    return {
      ...(rest as Condition),
      disease_count: condition_diseases?.[0]?.count ?? 0,
    };
  });
}

export async function getConditionDiseaseIds(
  conditionId: string
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("condition_diseases")
    .select("disease_id")
    .eq("condition_id", conditionId);
  if (error) throw new Error(`[conditions] ${error.code ?? ""} ${error.message} ${error.details ?? ""} ${error.hint ?? ""}`);
  return (data ?? []).map((r) => r.disease_id);
}

export async function getConditionBySlug(
  slug: string
): Promise<ConditionWithRemedies> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conditions")
    .select(
      `*,
      condition_remedy (
        display_order,
        icons,
        remedy:remedies (*)
      ),
      condition_diseases (
        disease:diseases ( id, name, slug, icon, severity, severity_label, status )
      )`
    )
    .eq("slug", slug)
    .single();
  if (error) throw new Error(`[conditions] ${error.code ?? ""} ${error.message} ${error.details ?? ""} ${error.hint ?? ""}`);
  return data as ConditionWithRemedies;
}
