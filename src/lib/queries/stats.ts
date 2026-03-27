import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [diseases, remedies, profiles, pendingDiseases] = await Promise.all([
    supabase.from("diseases").select("id", { count: "exact", head: true }),
    supabase.from("remedies").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "Active"),
    supabase
      .from("diseases")
      .select("id", { count: "exact", head: true })
      .eq("status", "Draft"),
  ]);

  return {
    totalDiseases: diseases.count ?? 0,
    totalRemedies: remedies.count ?? 0,
    activeUsers: profiles.count ?? 0,
    pendingReviews: pendingDiseases.count ?? 0,
  };
}
