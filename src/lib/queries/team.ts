import { createClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/supabase/types";

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data ?? []) as TeamMember[];
}
