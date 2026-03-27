import type { Metadata } from "next";
import { getSettings } from "@/lib/queries/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings - Herbal Admin",
};

export default async function SettingsPage() {
  const settings = await getSettings();

  return <SettingsForm settings={settings} />;
}
