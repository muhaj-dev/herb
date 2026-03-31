import Link from "next/link";

export default function ConditionNotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 bg-surface">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">
          search_off
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-text-main font-bold mb-4">
          Condition Not Found
        </h1>
        <p className="text-on-surface/60 mb-8">
          The condition you are looking for does not exist or may have been
          removed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/conditions"
            className="px-6 py-3 gradient-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse Conditions
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-primary/30 text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
