"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: true } | { error: string }> {
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    return { error: "All fields are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  });

  if (error) {
    return { error: "Failed to send message. Please try again." };
  }

  return { success: true };
}
