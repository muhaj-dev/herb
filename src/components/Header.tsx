"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/conditions", label: "Browse Conditions" },
  { href: "/remedies", label: "Remedies" },
  { href: "/safety", label: "Safety Guide" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="size-10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">spa</span>
              </div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-primary">
                HerbalWisdom
              </h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 mx-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                      : "text-on-surface/70 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/about"
                className="hidden md:flex items-center justify-center h-10 px-6 rounded-full gradient-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                Consult an Expert
              </Link>
              <button
                className="lg:hidden p-2 text-on-surface/60 hover:bg-surface-container-low rounded-lg transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <span className="material-symbols-outlined">
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-surface-container-lowest border-b border-outline-variant/20 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center text-base font-medium py-3 px-4 rounded-xl transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/5 font-bold"
                      : "text-on-surface/70 hover:text-primary hover:bg-surface-container-low"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full h-12 rounded-full gradient-primary text-on-primary text-sm font-bold shadow-md flex items-center justify-center cursor-pointer"
                >
                  Consult an Expert
                </Link>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-on-surface/30">
                <Link
                  href="/terms"
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-primary"
                >
                  Terms
                </Link>
                <span>&bull;</span>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-primary"
                >
                  About
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
