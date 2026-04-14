"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_ROLES = ["Super Admin", "Editor", "Contributor"] as const;

export async function signIn(formData: {
  email: string;
  password: string;
  redirectTo?: string;
}): Promise<{ error: string } | void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Invalid credentials." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return { error: "No profile found for this account." };
  }

  if (profile.status !== "Active" && profile.status !== "Away") {
    await supabase.auth.signOut();
    return { error: "Account is not active. Contact an administrator." };
  }

  if (!ADMIN_ROLES.includes(profile.role)) {
    await supabase.auth.signOut();
    return { error: "You do not have permission to access the admin area." };
  }

  revalidatePath("/", "layout");
  redirect(formData.redirectTo || "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url, role, status")
    .eq("id", user.id)
    .single();

  if (!profile) return null;
  if (!ADMIN_ROLES.includes(profile.role)) return null;
  return profile;
}
