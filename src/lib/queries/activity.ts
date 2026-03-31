import { createClient } from "@/lib/supabase/server";
import type { ActivityLog } from "@/lib/supabase/types";

type ActivityWithUser = ActivityLog & {
  user: { id: string; name: string; avatar_url: string | null } | null;
};

export async function getRecentActivity(limit = 10): Promise<ActivityWithUser[]> {
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
  return (data ?? []) as ActivityWithUser[];
}
