"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import type { AdminUser } from "./AdminShell";

const navLinks = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/diseases", icon: "coronavirus", label: "Diseases" },
  { href: "/admin/remedies", icon: "science", label: "Remedies" },
  { href: "/admin/conditions", icon: "health_and_safety", label: "Conditions" },
  { href: "/admin/categories", icon: "category", label: "Categories" },
  { href: "/admin/team", icon: "diversity_3", label: "Team" },
  { href: "/admin/settings", icon: "settings", label: "Settings" },
];

export default function AdminSidebar({ admin }: { admin: AdminUser }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col border-r border-[#234829] bg-[#112214]">
      <div className="h-full flex flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 items-center px-2">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#234829] overflow-hidden">
              <span className="material-symbols-outlined text-[#13ec37] text-2xl">
                eco
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-normal">
                Herbal Admin
              </h1>
              <p className="text-[#13ec37]/70 text-xs font-normal leading-normal">
                Manage Platform
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#234829] text-white"
                      : "text-slate-300 hover:bg-[#234829]/50 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {link.icon}
                  </span>
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#234829] flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            {admin.avatar_url ? (
              <Image
                src={admin.avatar_url}
                alt={admin.name}
                width={36}
                height={36}
                className="rounded-full object-cover ring-2 ring-[#13ec37]/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#234829] flex items-center justify-center ring-2 ring-[#13ec37]/30">
                <span className="text-sm font-bold text-[#13ec37]">
                  {admin.name?.[0]?.toUpperCase() ?? "A"}
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">
                {admin.name}
              </span>
              <span className="text-xs text-slate-400">{admin.role}</span>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#234829]/50 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
