import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDashboardStats } from "@/lib/queries/stats";
import { getRecentActivity } from "@/lib/queries/activity";

export const metadata: Metadata = {
  title: "Dashboard - Herbal Admin",
  description: "Admin dashboard overview for HerbalWisdom platform management.",
};

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

export default async function AdminDashboardPage() {
  const [dashboardStats, rawActivities] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(4),
  ]);

  const stats = [
    {
      label: "Total Diseases",
      value: dashboardStats.totalDiseases.toLocaleString(),
      icon: "coronavirus",
      iconBg: "bg-blue-500/10 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20",
    },
    {
      label: "Total Remedies",
      value: dashboardStats.totalRemedies.toLocaleString(),
      icon: "science",
      iconBg: "bg-purple-500/10 text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20",
    },
    {
      label: "Active Users",
      value: dashboardStats.activeUsers.toLocaleString(),
      icon: "group",
      iconBg: "bg-orange-500/10 text-orange-400 group-hover:text-orange-300 group-hover:bg-orange-500/20",
    },
    {
      label: "Pending Reviews",
      value: dashboardStats.pendingReviews.toLocaleString(),
      icon: "pending_actions",
      iconBg: "bg-red-500/10 text-red-400 group-hover:text-red-300 group-hover:bg-red-500/20",
    },
  ];

  const activities = rawActivities.map((a) => ({
    user: a.user?.name ?? null,
    avatar: a.user?.avatar_url ?? null,
    action: a.action ?? "",
    target: a.target_name ?? null,
    targetType: a.target_type ?? null,
    time: formatRelativeTime(a.created_at),
    icon: a.icon ?? "info",
    iconColor: a.icon === "check_circle" ? "text-[#13ec37]" : a.icon === "bug_report" ? "text-red-400" : "text-slate-500",
    systemIcon: a.user ? null : "dns",
  }));

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-[#102213]/95 backdrop-blur-sm z-10 border-b border-[#234829]">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Overview
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-[#13ec37] transition-colors text-[20px]">
              search
            </span>
            <input
              className="bg-[#1a3320] border border-[#234829] text-sm rounded-full pl-10 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13ec37]/50 focus:border-[#13ec37] w-64 transition-all"
              placeholder="Search database..."
              type="text"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-white relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#13ec37] rounded-full animate-pulse" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 flex flex-col gap-4 sm:gap-8 max-w-[1400px] mx-auto w-full">
        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#1a3320] border border-[#234829] min-h-[140px] sm:min-h-[200px] flex items-end shadow-lg">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1hDAQu2hgiHQf7MC6gsnghTJD_vVyCzVBQVkE6I1JTKbuniPo881VvEeXUhAMUKCtqc-v9JcJXFQ7zU-Z0lByZcOpE_I8Y_O0EgmcM66_AmyUlyNOVMUaYFKotl4Nxclrw8VAPWSqJ59irK9Js64MvjCZ325CIH7CgMeAXwfEcwTkoVSxPSviUzeh_oA2sqNil7bCBSNHIPwu5syAFt374TBUepCZrB3_32SAqOIWWGN-J1P2upFij1j-5ocJj44PqWwxGgT6mzI')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102213] via-[#102213]/50 to-transparent" />
          <div className="relative z-10 p-4 sm:p-6 lg:p-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-3 sm:gap-4">
              <div>
                <p className="text-[#13ec37] font-medium mb-1 text-xs sm:text-base">
                  Welcome back, Admin
                </p>
                <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                  System Status: Healthy
                </h3>
                <p className="text-slate-400 mt-1 sm:mt-2 max-w-lg text-xs sm:text-base">
                  Everything is running smoothly. There are {dashboardStats.pendingReviews} pending reviews
                  requiring your attention today.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a3320] border border-[#234829] p-3 sm:p-5 rounded-xl flex flex-col gap-1 hover:border-[#13ec37]/30 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div
                  className={`p-2 rounded-lg transition-colors ${stat.iconBg}`}
                >
                  <span className="material-symbols-outlined">
                    {stat.icon}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">{stat.label}</p>
              <p className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Content: Activity + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-xl font-bold text-white">Recent Activity</h3>
              <Link
                href="#"
                className="text-sm text-[#13ec37] hover:text-[#13ec37]/80 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl overflow-hidden">
              {activities.map((activity, i) => (
                <div
                  key={i}
                  className={`p-3 sm:p-4 hover:bg-[#234829]/30 transition-colors flex gap-3 sm:gap-4 items-start ${
                    i < activities.length - 1
                      ? "border-b border-[#234829]"
                      : ""
                  }`}
                >
                  {activity.avatar ? (
                    <Image
                      src={activity.avatar}
                      alt={activity.user || "User"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-[20px]">
                        {activity.systemIcon}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">
                      {activity.user && (
                        <span className="font-bold text-white">
                          {activity.user}
                        </span>
                      )}{" "}
                      {activity.action}{" "}
                      {activity.target && (
                        <span className="text-[#13ec37]">
                          {activity.target}
                        </span>
                      )}
                      {activity.targetType &&
                        activity.target &&
                        ` ${activity.targetType === "description" ? activity.targetType : `to ${activity.targetType}`}.`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[18px] ${activity.iconColor}`}
                  >
                    {activity.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions + Storage */}
          <div className="flex flex-col gap-8">
            {/* Quick Actions */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-xl font-bold text-white">Quick Actions</h3>
              <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-3 sm:p-5 flex flex-col gap-2 sm:gap-3">
                <Link
                  href="/admin/diseases/new"
                  className="w-full bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#102213] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add New Disease
                </Link>
                <Link
                  href="/admin/remedies/new"
                  className="w-full bg-[#234829] hover:bg-[#234829]/80 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[#13ec37]">
                    science
                  </span>
                  Add New Remedy
                </Link>
                <Link
                  href="/admin/users"
                  className="w-full bg-[#234829] hover:bg-[#234829]/80 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-400">
                    person_add
                  </span>
                  Manage Users
                </Link>
              </div>
            </div>

            {/* Database Summary */}
            <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-3 sm:p-5">
              <h4 className="font-bold text-white text-sm sm:text-base mb-4">Database Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Diseases</span>
                  <span className="text-white font-bold">{dashboardStats.totalDiseases}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Remedies</span>
                  <span className="text-white font-bold">{dashboardStats.totalRemedies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Users</span>
                  <span className="text-white font-bold">{dashboardStats.activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pending Reviews</span>
                  <span className="text-white font-bold">{dashboardStats.pendingReviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Herbal Admin Dashboard. All rights
          reserved.
        </footer>
      </div>
    </>
  );
}
