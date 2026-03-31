import { createClient } from "@/lib/supabase/server";
import type { Disease } from "@/lib/supabase/types";

type DiseaseWithRemedies = Disease & {
  disease_remedy: { tag: string | null; remedy: { id: string; name: string; slug: string } }[];
};

type DiseaseWithFullRemedies = Disease & {
  disease_remedy: {
    tag: string | null;
    remedy: {
      id: string; name: string; slug: string; scientific_name: string | null;
      type: string | null; prep_time: string | null; description: string | null;
      short_description: string | null; image: string | null;
    };
  }[];
};

export async function getDiseases(): Promise<DiseaseWithRemedies[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diseases")
    .select(
      `*,
      disease_remedy (
        tag,
        remedy:remedies ( id, name, slug )
      )`
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DiseaseWithRemedies[];
}

export async function getPublicDiseases(): Promise<DiseaseWithRemedies[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diseases")
    .select(
      `*,
      disease_remedy (
        remedy:remedies ( id, name, slug )
      )`
    )
    .eq("status", "Active")
    .order("name");
  if (error) throw error;
  return (data ?? []) as DiseaseWithRemedies[];
}

export async function getDiseaseBySlug(slug: string): Promise<DiseaseWithFullRemedies> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diseases")
    .select(
      `*,
      disease_remedy (
        tag,
        remedy:remedies ( id, name, slug, scientific_name, type, prep_time, description, short_description, image )
      )`
    )
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as DiseaseWithFullRemedies;
}
