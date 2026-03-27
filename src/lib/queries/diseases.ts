import { createClient } from "@/lib/supabase/server";

export async function getDiseases() {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any[];
}

export async function getPublicDiseases() {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any[];
}

export async function getDiseaseBySlug(slug: string) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
}
