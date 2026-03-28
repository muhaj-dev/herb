import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - HerbalWisdom",
  description:
    "Get in touch with the HerbalWisdom team. Reach out for consultations, partnerships, or general inquiries about herbal remedies and wellness.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
