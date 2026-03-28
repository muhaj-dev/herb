import type { Metadata } from "next";
import { getUsers } from "@/lib/queries/users";
import UserTable from "./_components/UserTable";

export const metadata: Metadata = {
  title: "User Management - Herbal Admin",
};

const roleColorMap: Record<
  string,
  { roleColor: string; dotColor: string }
> = {
  "Super Admin": {
    roleColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    dotColor: "bg-purple-400",
  },
  Editor: {
    roleColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotColor: "bg-blue-400",
  },
  Contributor: {
    roleColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dotColor: "bg-orange-400",
  },
  Viewer: {
    roleColor: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    dotColor: "bg-slate-400",
  },
};

const statusColorMap: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400 border-green-500/20",
  Away: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Inactive: "bg-red-500/10 text-red-400 border-red-500/20",
  "Pending Invite": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

function formatLastActive(lastActiveAt: string | null): string {
  if (!lastActiveAt) return "--";
  const now = Date.now();
  const then = new Date(lastActiveAt).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;
}

export default async function UsersPage() {
  const rawUsers = await getUsers();

  const users = rawUsers.map((p) => {
    const role = p.role ?? "Viewer";
    const status = p.status ?? "Active";
    const { roleColor, dotColor } = roleColorMap[role] ?? {
      roleColor: "bg-slate-500/10 text-slate-300 border-slate-500/20",
      dotColor: "bg-slate-400",
    };
    const statusColor =
      statusColorMap[status] ??
      "bg-slate-500/10 text-slate-300 border-slate-500/20";

    const nameParts = (p.name ?? "").split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : (p.name ?? "?").slice(0, 2).toUpperCase();

    return {
      name: p.name ?? "Unknown",
      email: p.email ?? "",
      avatar: p.avatar_url ?? null,
      initials,
      role,
      roleColor,
      dotColor,
      status,
      statusColor,
      lastActive: formatLastActive(p.last_active_at ?? null),
    };
  });

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          User Management
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-[#13ec37] transition-colors text-[20px]">
              search
            </span>
            <input
              className="bg-[#1a3320] border border-[#234829] text-sm rounded-full pl-10 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13ec37]/50 focus:border-[#13ec37] w-64 transition-all"
              placeholder="Search users..."
              type="text"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-white relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#13ec37] rounded-full animate-pulse" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 flex flex-col gap-4 sm:gap-6 max-w-[1400px] mx-auto w-full">
        <UserTable users={users} />
      </div>

      <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Herbal Admin Dashboard. All rights
        reserved.
      </footer>
    </>
  );
}
