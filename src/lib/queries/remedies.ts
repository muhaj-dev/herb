import { createClient } from "@/lib/supabase/server";
import type { Remedy } from "@/lib/supabase/types";

export async function getFeaturedRemedies(): Promise<Remedy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("remedies")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Remedy[];
}

export async function getRemedyBySlug(slug: string): Promise<Remedy> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("remedies")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as Remedy;
}

export async function getRelatedRemedies(currentSlug: string, limit = 3): Promise<Remedy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("remedies")
    .select("*")
    .neq("slug", currentSlug)
    .eq("is_active", true)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Remedy[];
}

export async function getAllRemedies(): Promise<Remedy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("remedies")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  return (data ?? []) as Remedy[];
}

export async function getAllRemediesAdmin(): Promise<Remedy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("remedies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Remedy[];
}

export async function getConditionsForRemedy(
  remedyId: string
): Promise<{ name: string; slug: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("condition_remedy")
    .select("condition:conditions(name, slug)")
    .eq("remedy_id", remedyId);
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.condition).filter(Boolean);
}
