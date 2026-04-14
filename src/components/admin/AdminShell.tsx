"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminMobileNav from "./AdminMobileNav";

export type AdminUser = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: string;
};

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#102213] text-slate-100">
      <AdminSidebar admin={admin} />

      <AdminMobileNav
        admin={admin}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#112214] border-b border-[#234829] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#13ec37]">
              eco
            </span>
            <span className="font-bold text-white">Herbal Admin</span>
          </div>
          <button
            className="text-white p-2 hover:bg-[#234829] rounded-lg transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}
