import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiseaseBySlug } from "@/lib/queries/diseases";

export default async function ConditionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = await getDiseaseBySlug(slug);
  } catch {
    notFound();
  }

  if (!data || data.status !== "Active") notFound();

  const description: string[] = Array.isArray(data.description)
    ? data.description
    : data.description
      ? [data.description]
      : [];
  const symptoms: string[] = data.symptoms ?? [];
  const remedies = (data.disease_remedy ?? []).map((dr: any) => ({
    id: dr.remedy.id as string,
    name: dr.remedy.name as string,
    scientific: (dr.remedy.scientific_name ?? "") as string,
    slug: dr.remedy.slug as string,
    type: (dr.remedy.type ?? "Herbal") as string,
    prepTime: (dr.remedy.prep_time ?? "") as string,
    desc: (dr.remedy.description ?? dr.remedy.short_description ?? "") as string,
    image: dr.remedy.image as string | null,
  }));

  return (
    <>
      {/* ── Header Section ── */}
      <section className="bg-accent/30 py-12 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/conditions"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-6 group transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to All Conditions
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {data.category && (
                  <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-2 py-1 rounded-full capitalize">
                    {data.category}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-main flex items-center gap-4">
                {data.name}
                <span className="material-symbols-outlined text-4xl text-primary/60">
                  {data.icon ?? "local_hospital"}
                </span>
              </h1>
              {description.length > 0 && (
                <div className="mt-4 text-lg text-on-surface/50 max-w-2xl space-y-3">
                  {description.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Symptoms ── */}
      {symptoms.length > 0 && (
        <section className="py-10 px-4 bg-surface border-b border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-serif font-bold text-text-main mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">sick</span>
              Common Symptoms
            </h2>
            <div className="flex flex-wrap gap-3">
              {symptoms.map((symptom: string) => (
                <span
                  key={symptom}
                  className="inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 rounded-lg text-sm text-on-surface/70"
                >
                  <span className="material-symbols-outlined text-red-400 text-[16px]">circle</span>
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Remedies Grid ── */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-text-main">
              {remedies.length} Remed{remedies.length !== 1 ? "ies" : "y"} Found
            </h2>
          </div>

          {remedies.length === 0 ? (
            <p className="text-center text-on-surface/40 py-16 text-lg">
              No remedies linked to this condition yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remedies.map((remedy: any) => (
                <article
                  key={remedy.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group overflow-hidden"
                >
                  {/* Card Image */}
                  <div className="relative h-64 overflow-hidden bg-surface-container-low">
                    {remedy.image ? (
                      <Image
                        src={remedy.image}
                        alt={remedy.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[60px] text-on-surface/10">
                          local_florist
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-primary rounded-full border border-primary/10 uppercase tracking-wide">
                        {remedy.type}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-serif font-bold text-text-main group-hover:text-primary transition-colors">
                        {remedy.name}
                      </h3>
                    </div>
                    {remedy.scientific && (
                      <p className="text-sm text-primary font-medium mb-3 italic">
                        {remedy.scientific}
                      </p>
                    )}
                    <p className="text-on-surface/50 text-sm leading-relaxed mb-6 line-clamp-3">
                      {remedy.desc}
                    </p>

                    <div className="mt-auto border-t border-outline-variant/10 pt-4 flex items-center justify-between">
                      {remedy.prepTime && (
                        <div className="flex items-center gap-2 text-xs text-on-surface/40">
                          <span className="material-symbols-outlined text-base">
                            schedule
                          </span>
                          <span>{remedy.prepTime}</span>
                        </div>
                      )}
                      <Link
                        href={`/remedies/${remedy.slug}`}
                        className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group/btn ml-auto"
                      >
                        View Full Recipe
                        <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-12 px-4 bg-accent/20 border-t border-primary/10">
        <div className="max-w-4xl mx-auto flex items-start gap-4 p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-orange-100">
          <span className="material-symbols-outlined text-3xl text-orange-500 shrink-0">
            warning
          </span>
          <div>
            <h3 className="font-serif font-bold text-lg text-text-main mb-2">
              Important Safety Information
            </h3>
            <p className="text-sm text-on-surface/50">
              The remedies listed here are for informational purposes only and should not replace
              professional medical advice. Always consult a qualified healthcare provider before
              starting any herbal treatment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
