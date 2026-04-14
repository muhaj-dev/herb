import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/actions/auth-actions";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
