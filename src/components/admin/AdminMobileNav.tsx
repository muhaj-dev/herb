"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/diseases", icon: "coronavirus", label: "Diseases" },
  { href: "/admin/remedies", icon: "science", label: "Remedies" },
  { href: "/admin/conditions", icon: "health_and_safety", label: "Conditions" },
  { href: "/admin/categories", icon: "category", label: "Categories" },
  { href: "/admin/team", icon: "diversity_3", label: "Team" },
  { href: "/admin/users", icon: "group", label: "Users" },
  { href: "/admin/settings", icon: "settings", label: "Settings" },
];

export default function AdminMobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col border-r border-[#234829] bg-[#112214] shadow-2xl animate-in slide-in-from-left">
        <div className="h-full flex flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            {/* Header with close */}
            <div className="flex items-center justify-between px-2">
              <div className="flex gap-3 items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#234829]">
                  <span className="material-symbols-outlined text-[#13ec37] text-2xl">
                    eco
                  </span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-white text-base font-bold">
                    Herbal Admin
                  </h1>
                  <p className="text-[#13ec37]/70 text-xs">Manage Platform</p>
                </div>
              </div>
              <button
                className="p-2 text-slate-400 hover:text-white hover:bg-[#234829] rounded-lg transition-colors"
                onClick={onClose}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Navigation */}
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
                    onClick={onClose}
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

          {/* User Profile */}
          <div className="pt-4 border-t border-[#234829]">
            <div className="flex items-center gap-3 px-2">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz6b5gX1rEfBqxEDcB-NoapXL_fJ0K0zNwkSPCK_MNJn4DXWOJG7uxmw2na8z-Ak6z5DEgSmSXJgHzWhZUYnLGlvs54NZUi6kFIJKCp5Lj1YKw-ELFyTPZCRCBsmkr1-S7CVu5Fkf-CY8hSDJOz42dN8kBVhhC2mpTDC6YmDSzWa4dASd36ckBGkZxwP-Uw_KQZy1RkNXSdyfqZcrJk5H32RjnbPBS2e2vS3yQzr3gcy2l4i_9qa0HjxKz7rneZcwERvjsu-f54vo"
                alt="Admin Profile"
                width={36}
                height={36}
                className="rounded-full object-cover ring-2 ring-[#13ec37]/30"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  Alex Morgan
                </span>
                <span className="text-xs text-slate-400">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
