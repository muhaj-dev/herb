"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(
  email: string
): Promise<{ success: true } | { error: string }> {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: email.toLowerCase().trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return { success: true };
    }
    return { error: "Failed to subscribe. Please try again." };
  }

  return { success: true };
}
