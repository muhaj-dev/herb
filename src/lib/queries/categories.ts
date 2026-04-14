import { createClient } from "@/lib/supabase/server";
import type { Category, Disease } from "@/lib/supabase/types";

export type CategoryWithCounts = Category & { disease_count: number };

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");
  if (error) throw new Error(`[categories] ${error.code} ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getCategoriesWithDiseaseCount(): Promise<
  CategoryWithCounts[]
> {
  const supabase = await createClient();
  const { data: cats, error: e1 } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");
  if (e1) throw new Error(`[categories] ${e1.code} ${e1.message}`);

  const { data: conds, error: e2 } = await supabase
    .from("conditions")
    .select("id, category_id, condition_diseases(disease_id)");
  if (e2) throw new Error(`[categories] ${e2.code} ${e2.message}`);

  const map = new Map<string, Set<string>>();
  for (const row of (conds ?? []) as Array<{
    category_id: string | null;
    condition_diseases: { disease_id: string }[] | null;
  }>) {
    if (!row.category_id) continue;
    const set = map.get(row.category_id) ?? new Set<string>();
    for (const cd of row.condition_diseases ?? []) {
      set.add(cd.disease_id);
    }
    map.set(row.category_id, set);
  }

  return (cats ?? []).map((c) => ({
    ...(c as Category),
    disease_count: map.get((c as Category).id)?.size ?? 0,
  }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<{ category: Category; diseases: Disease[] } | null> {
  const supabase = await createClient();
  const { data: cat, error: e1 } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (e1) throw new Error(`[categories] ${e1.code} ${e1.message}`);
  if (!cat) return null;

  const { data: conds, error: e2 } = await supabase
    .from("conditions")
    .select("id")
    .eq("category_id", (cat as Category).id);
  if (e2) throw new Error(`[categories] ${e2.code} ${e2.message}`);

  const conditionIds = (conds ?? []).map((c) => (c as { id: string }).id);
  if (conditionIds.length === 0) {
    return { category: cat as Category, diseases: [] };
  }

  const { data: links, error: e3 } = await supabase
    .from("condition_diseases")
    .select("disease_id")
    .in("condition_id", conditionIds);
  if (e3) throw new Error(`[categories] ${e3.code} ${e3.message}`);

  const diseaseIds = Array.from(
    new Set((links ?? []).map((l) => (l as { disease_id: string }).disease_id))
  );
  if (diseaseIds.length === 0) {
    return { category: cat as Category, diseases: [] };
  }

  const { data: diseases, error: e4 } = await supabase
    .from("diseases")
    .select("*")
    .in("id", diseaseIds)
    .eq("status", "Active")
    .order("name");
  if (e4) throw new Error(`[categories] ${e4.code} ${e4.message}`);

  return {
    category: cat as Category,
    diseases: (diseases ?? []) as Disease[],
  };
}
