import { createClient } from "@/lib/supabase/server";

export async function getRecentActivity(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_log")
    .select(
      `*,
      user:profiles ( id, name, avatar_url )`
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any[];
}
