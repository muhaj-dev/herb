import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login - Herbal",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#102213] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-full bg-[#234829] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#13ec37] text-3xl">
              eco
            </span>
          </div>
          <h1 className="text-white text-2xl font-bold">Herbal Admin</h1>
          <p className="text-slate-400 text-sm">
            Sign in to manage the platform
          </p>
        </div>
        <div className="bg-[#1a3320] border border-[#234829] rounded-xl p-6 sm:p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
