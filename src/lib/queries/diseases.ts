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
      yoruba_name: string | null;
      type: string | null; prep_time: string | null; description: string | null;
      short_description: string | null; image: string | null;
      is_active: boolean;
    };
  }[];
};

export async function getDiseaseOptions(): Promise<
  { id: string; name: string; status: string }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diseases")
    .select("id, name, status")
    .order("name");
  if (error) throw error;
  return (data ?? []) as { id: string; name: string; status: string }[];
}

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

export async function getFeaturedDiseases(): Promise<Disease[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diseases")
    .select("*")
    .eq("status", "Active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;
  return (data ?? []) as Disease[];
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
        remedy:remedies ( id, name, slug, scientific_name, yoruba_name, type, prep_time, description, short_description, image, is_active )
      )`
    )
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as DiseaseWithFullRemedies;
}
