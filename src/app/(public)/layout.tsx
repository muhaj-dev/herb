import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteName = "HerbalWisdom";
  try {
    const settings = await getSettings();
    siteName = settings.site_name || siteName;
  } catch {
    // Fall back to default if site_settings row is missing
  }

  return (
    <>
      <Header siteName={siteName} />
      <main className="flex-grow">{children}</main>
      <Footer siteName={siteName} />
    </>
  );
}
