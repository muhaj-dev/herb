import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - HerbalWisdom",
  description:
    "Frequently asked questions about HerbalWisdom, herbal remedy safety, consultations, sourcing, and how to get started with plant-based wellness.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
