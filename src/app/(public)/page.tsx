import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/queries/categories";
import { getFeaturedRemedies } from "@/lib/queries/remedies";
import HeroSearch from "./_components/HeroSearch";
import NewsletterForm from "./_components/NewsletterForm";

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  pink: { bg: "bg-pink-50", text: "text-pink-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
};

export default async function HomePage() {
  const [categories, remediesData] = await Promise.all([
    getCategories(),
    getFeaturedRemedies(),
  ]);

  const remedies = remediesData.map((r) => ({
    name: r.name,
    scientific: r.scientific_name || "",
    desc: r.short_description || r.description || "",
    tag: r.type || "Herbal",
    tagColor: "text-primary",
    readTime: r.prep_time || "5 min read",
    slug: r.slug,
    image: r.image || "",
  }));
  return (
    <>
      {/* ── Hero with Search ── */}
      <section className="relative w-full py-12 md:py-20 lg:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-surface z-10" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPidraaHnbAATk7Qs0-w6WwtUy8txoLvCCjw08DeyWob3PdyfnwF9aJ7IVeGqvVh3JO7ktm1KuthEgrSIfgfTyjR7-x_Ap5tT8s839u4aOyve9iFdV8e0cuSGgcfAy6w5ah3Oe8JKhwQt2-U5JuyLZIx7UlHGroAviIZGAGxu-D8c_NaFt5RPvwSx1vC7jsyx7HRmMppauezfxXWY1lcv53-w62bDrqdroaaghFj0wAeCOSKQjbgUo0CBKO6yVTC4pSBLzTC5Fyok"
            alt="Fresh green herbs and mortar pestle on wooden table"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">verified</span>
            Trusted by 50k+ Users
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-sm">
            Nature&apos;s Wisdom for <br className="hidden md:block" />
            Your Wellbeing
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-200 max-w-2xl font-medium drop-shadow-sm">
            Discover thousands of natural remedies, holistic cures, and
            botanical secrets for a healthier, balanced life.
          </p>

          {/* Search Bar */}
          <HeroSearch />
        </div>
      </section>

      {/* ── Popular Categories ── */}
      <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
            Popular Categories
          </h2>
          <Link
            href="/conditions"
            className="hidden sm:flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            View all categories
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const c = colorMap[cat.color || "green"] || colorMap.green;
            return (
              <Link
                key={cat.name}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full ${c.bg} ${c.text} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">
                    {cat.icon}
                  </span>
                </div>
                <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/conditions"
            className="flex items-center gap-1 text-primary font-semibold hover:underline text-sm"
          >
            View all categories
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>

      {/* ── Latest Herbal Remedies ── */}
      <section className="py-12 md:py-16 px-4 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight mb-2">
                Latest Herbal Remedies
              </h2>
              <p className="text-on-surface/50 max-w-xl text-sm sm:text-base">
                Explore recently added botanicals and their healing properties
                backed by traditional wisdom.
              </p>
            </div>
            <Link
              href="/remedies"
              className="flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              View all remedies
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {remedies.map((remedy) => (
              <article
                key={remedy.slug}
                className="flex flex-col rounded-xl overflow-hidden bg-surface border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/10 transition-shadow group"
              >
                <div className="h-44 sm:h-56 overflow-hidden relative">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded uppercase tracking-wide z-10">
                    <span className={remedy.tagColor}>{remedy.tag}</span>
                  </div>
                  <Image
                    src={remedy.image}
                    alt={remedy.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <h3 className="text-base sm:text-xl font-serif font-bold text-on-surface group-hover:text-primary transition-colors">
                      {remedy.name}
                    </h3>
                    <p className="text-xs font-medium text-on-surface/40 italic">
                      {remedy.scientific}
                    </p>
                  </div>
                  <p className="text-on-surface/50 text-sm line-clamp-2 mb-4">
                    {remedy.desc}
                  </p>
                  <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-xs text-on-surface/40 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        schedule
                      </span>
                      {remedy.readTime}
                    </span>
                    <Link
                      href={`/remedies/${remedy.slug}`}
                      className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read Benefits
                      <span className="material-symbols-outlined text-sm">
                        arrow_right_alt
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 px-4 bg-primary/5 border-t border-outline-variant/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">
              mark_email_unread
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-on-surface mb-4">
            Get Natural Health Tips Weekly
          </h2>
          <p className="text-on-surface/50 mb-8 max-w-lg mx-auto text-sm sm:text-base">
            Join our community of 50,000+ subscribers and receive seasonal
            remedy guides, herb spotlights, and wellness advice directly to your
            inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
