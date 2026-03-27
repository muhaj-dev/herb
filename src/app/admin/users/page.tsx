import Image from "next/image";
import type { Metadata } from "next";
import { getUsers } from "@/lib/queries/users";

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">All Users</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage admin access and staff roles
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1a3320] hover:bg-[#234829] border border-[#234829] text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-colors">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                filter_list
              </span>
              Filter
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#102213] rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-transform active:scale-95 shadow-lg shadow-[#13ec37]/20">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                person_add
              </span>
              Invite User
            </button>
          </div>
        </div>

        {/* ── Users Table ── */}
        <div className="bg-[#1a3320] border border-[#234829] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#234829]/50 border-b border-[#234829] text-xs uppercase text-slate-400 font-semibold tracking-wider">
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Name</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Role</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#234829]">
                {users.map((user) => (
                  <tr
                    key={user.email}
                    className="hover:bg-[#234829]/30 transition-colors group"
                  >
                    {/* Name + Avatar */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#13ec37]/20 transition-all"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 ring-2 ring-transparent group-hover:ring-[#13ec37]/20 transition-all">
                            <span className="font-bold">
                              {user.initials}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.roleColor}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${user.dotColor}`}
                        />
                        {user.role}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.statusColor}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    {/* Last Active */}
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {user.lastActive}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-white p-2 hover:bg-[#234829] rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-[#234829] flex items-center justify-between bg-[#234829]/10">
            <p className="text-xs sm:text-sm text-slate-400">
              Showing <span className="font-medium text-white">1</span> to{" "}
              <span className="font-medium text-white">{users.length}</span> of{" "}
              <span className="font-medium text-white">{users.length}</span> results
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-[#234829] rounded-md text-slate-400 hover:text-white hover:bg-[#234829] disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 text-sm border border-[#234829] rounded-md text-slate-400 hover:text-white hover:bg-[#234829]">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ── Pending Invitations ── */}
        {(() => {
          const pending = users.filter((u) => u.status === "Pending Invite");
          if (pending.length === 0) return null;
          return (
            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
                Pending Invitations ({pending.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map((user) => (
                  <div key={user.email} className="bg-[#1a3320] border border-[#234829] p-3 sm:p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#234829] flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-300">
                          mail
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.email}
                        </p>
                        <p className="text-xs text-slate-500">{user.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Herbal Admin Dashboard. All rights
        reserved.
      </footer>
    </>
  );
}
