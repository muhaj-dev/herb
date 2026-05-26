"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

const ADMIN_ROLES = ["Super Admin", "Editor", "Contributor"] as const;

// Login limits: at most 5 attempts per 15 minutes, both per-IP and per-email.
// Per-email prevents an attacker spraying one account from many IPs; per-IP
// prevents one IP from spraying many accounts.
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Trust the first hop from common proxy headers; fall back to a constant
  // so behind a reverse-proxy/dev we still get a stable key.
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function signIn(formData: {
  email: string;
  password: string;
  redirectTo?: string;
}): Promise<{ error: string } | void> {
  const email = formData.email.trim().toLowerCase();
  const ip = await getClientIp();

  // Check both buckets before touching Supabase so we don't leak timing info
  // or burn auth quota on a flood.
  const ipCheck = rateLimit(`login:ip:${ip}`, {
    max: LOGIN_MAX_ATTEMPTS,
    windowMs: LOGIN_WINDOW_MS,
  });
  if (!ipCheck.allowed) {
    return {
      error: `Too many login attempts from your network. Try again in ${ipCheck.retryAfterSeconds}s.`,
    };
  }
  const emailCheck = rateLimit(`login:email:${email}`, {
    max: LOGIN_MAX_ATTEMPTS,
    windowMs: LOGIN_WINDOW_MS,
  });
  if (!emailCheck.allowed) {
    return {
      error: `Too many attempts for this account. Try again in ${emailCheck.retryAfterSeconds}s.`,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
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

  // Successful login — clear this user's buckets so they aren't penalised
  // later for earlier failed attempts.
  resetRateLimit(`login:ip:${ip}`);
  resetRateLimit(`login:email:${email}`);

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
