"use client";

import Image from "next/image";
import { useState, useMemo } from "react";

type User = {
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  role: string;
  roleColor: string;
  dotColor: string;
  status: string;
  statusColor: string;
  lastActive: string;
};

export default function UserTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = users;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }

    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    return result;
  }, [users, query, roleFilter]);

  const roles = useMemo(() => {
    const map = new Map<string, number>();
    users.forEach((u) => map.set(u.role, (map.get(u.role) ?? 0) + 1));
    return Array.from(map.entries());
  }, [users]);

  return (
    <>
      {/* Header with search */}
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

      {/* Search & role filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
            search
          </span>
          <input
            className="bg-[#1a3320] border border-[#234829] text-sm rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13ec37]/50 focus:border-[#13ec37] w-full transition-all"
            placeholder="Search users by name or email..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRoleFilter(null)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              !roleFilter
                ? "bg-[#13ec37] text-[#102213]"
                : "bg-[#234829]/50 text-slate-300 hover:bg-[#234829]"
            }`}
          >
            All ({users.length})
          </button>
          {roles.map(([role, count]) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                roleFilter === role
                  ? "bg-[#13ec37] text-[#102213]"
                  : "bg-[#234829]/50 text-slate-300 hover:bg-[#234829]"
              }`}
            >
              {role} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-600">
                      person_search
                    </span>
                    {query
                      ? `No users match "${query}"`
                      : "No users found"}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.email}
                    className="hover:bg-[#234829]/30 transition-colors group"
                  >
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
                            <span className="font-bold">{user.initials}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.roleColor}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.dotColor}`} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.statusColor}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-white p-2 hover:bg-[#234829] rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-[#234829] flex items-center justify-between bg-[#234829]/10">
          <p className="text-xs sm:text-sm text-slate-400">
            Showing <span className="font-medium text-white">{filtered.length}</span> of{" "}
            <span className="font-medium text-white">{users.length}</span> results
          </p>
        </div>
      </div>
    </>
  );
}
