"use client";

import { useTransition } from "react";
import { updateSettings } from "@/lib/actions/settings-actions";
import type { SiteSettings } from "@/lib/supabase/types";

const settingsTabs = [
  { id: "general", icon: "tune", label: "General", active: true },
  { id: "account", icon: "person", label: "Account", active: false },
  { id: "notifications", icon: "notifications", label: "Notifications", active: false },
  { id: "security", icon: "security", label: "Security", active: false },
];
export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    startTransition(async () => {
      await updateSettings(settings.id, {
        site_name: formData.get("site_name") as string,
        tagline: formData.get("tagline") as string,
        support_email: formData.get("support_email") as string,
        phone: formData.get("phone") as string,
        emergency_contact: formData.get("emergency_contact") as string,
        address: formData.get("address") as string,
        currency: formData.get("currency") as string,
        timezone: formData.get("timezone") as string,
      });
    });
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-1 sm:mb-2">
            Settings
          </h1>
          <p className="text-[#92c99b] text-sm sm:text-base max-w-2xl">
            Manage your dashboard preferences, account security, and global site
            configuration.
          </p>
        </div>

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Vertical Tabs */}
          <div className="lg:w-64 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {settingsTabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 whitespace-nowrap lg:whitespace-normal transition-all ${
                    tab.active
                      ? "bg-[#13ec37]/10 text-[#13ec37] border-[#13ec37]"
                      : "text-[#92c99b] hover:bg-[#1a331e] hover:text-white border-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span className="font-bold text-sm">{tab.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Settings Panel */}
          <div className="flex-1 min-w-0">
            <form action={handleSave}>
              <div className="space-y-6">
                {/* Site Identity */}
                <section className="bg-[#1a331e] rounded-xl p-4 sm:p-6 border border-[#234829]">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#234829]">
                    <div className="p-2 bg-[#234829] rounded-lg text-[#13ec37]">
                      <span className="material-symbols-outlined">language</span>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Site Identity
                      </h2>
                      <p className="text-xs sm:text-sm text-[#92c99b]">
                        Basic information about your herbal store visible to
                        customers.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Site Name
                      </label>
                      <input
                        name="site_name"
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] placeholder-[#92c99b]/50 transition-colors"
                        type="text"
                        defaultValue={settings.site_name ?? "HerbalWisdom"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Tagline
                      </label>
                      <input
                        name="tagline"
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] placeholder-[#92c99b]/50 transition-colors"
                        type="text"
                        defaultValue={settings.tagline ?? "Ancient Remedies, Modern Wellness"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Support Email
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#92c99b]">
                          <span className="material-symbols-outlined text-[20px]">
                            mail
                          </span>
                        </span>
                        <input
                          name="support_email"
                          className="w-full bg-[#112214] border border-[#32673b] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] placeholder-[#92c99b]/50 transition-colors"
                          type="email"
                          defaultValue={settings.support_email ?? "support@herbalwisdom.com"}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Details */}
                <section className="bg-[#1a331e] rounded-xl p-4 sm:p-6 border border-[#234829]">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#234829]">
                    <div className="p-2 bg-[#234829] rounded-lg text-[#13ec37]">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Contact Details
                      </h2>
                      <p className="text-xs sm:text-sm text-[#92c99b]">
                        Where customers can reach you physically or by phone.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] placeholder-[#92c99b]/50 transition-colors"
                        type="tel"
                        defaultValue={settings.phone ?? "+1 (555) 123-4567"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Emergency Contact
                      </label>
                      <input
                        name="emergency_contact"
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] placeholder-[#92c99b]/50 transition-colors"
                        type="tel"
                        defaultValue={settings.emergency_contact ?? ""}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Office Address
                      </label>
                      <textarea
                        name="address"
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] placeholder-[#92c99b]/50 transition-colors"
                        rows={3}
                        defaultValue={settings.address ?? "123 Botanical Lane, Portland, OR 97201"}
                      />
                    </div>
                  </div>
                </section>

                {/* Regional Preferences */}
                <section className="bg-[#1a331e] rounded-xl p-4 sm:p-6 border border-[#234829]">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#234829]">
                    <div className="p-2 bg-[#234829] rounded-lg text-[#13ec37]">
                      <span className="material-symbols-outlined">public</span>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Regional Preferences
                      </h2>
                      <p className="text-xs sm:text-sm text-[#92c99b]">
                        Set default currency and timezones for the dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        defaultValue={settings.currency ?? "USD ($)"}
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-colors appearance-none"
                      >
                        <option>USD ($)</option>
                        <option>EUR (&euro;)</option>
                        <option>GBP (&pound;)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        defaultValue={settings.timezone ?? "(GMT-08:00) Pacific Time"}
                        className="w-full bg-[#112214] border border-[#32673b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#13ec37] focus:ring-1 focus:ring-[#13ec37] transition-colors appearance-none"
                      >
                        <option>(GMT-08:00) Pacific Time</option>
                        <option>(GMT-05:00) Eastern Time</option>
                        <option>(GMT+00:00) London</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="reset"
                    className="px-6 py-2.5 rounded-lg text-[#92c99b] font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-lg bg-[#13ec37] hover:bg-[#13ec37]/90 text-[#112214] font-bold shadow-lg shadow-[#13ec37]/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      save
                    </span>
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
