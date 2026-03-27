import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRemedyBySlug,
  getRelatedRemedies,
  getConditionsForRemedy,
} from "@/lib/queries/remedies";

export default async function RemedyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let remedy: any;
  try {
    remedy = await getRemedyBySlug(slug);
  } catch {
    notFound();
  }

  if (!remedy) notFound();

  const [dbRelated, conditions] = await Promise.all([
    getRelatedRemedies(slug, 3),
    getConditionsForRemedy(remedy.id),
  ]);

  const relatedHerbs = dbRelated.map((r) => ({
    name: r.name,
    scientific: r.scientific_name,
    tag: r.type || "Herbal",
    image: r.image,
    slug: r.slug,
  }));

  const preparationSteps: { title: string; desc: string }[] = (
    remedy.preparation_steps || ""
  )
    .split("\n")
    .filter((s: string) => s.trim())
    .map((step: string, i: number) => {
      const parts = step.split(": ");
      return {
        title: parts.length > 1 ? parts[0] : `Step ${i + 1}`,
        desc: parts.length > 1 ? parts.slice(1).join(": ") : step,
      };
    });

  const precautions: string[] = remedy.precautions
    ? remedy.precautions
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column: Main Detail ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Hero Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {remedy.type && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {remedy.type}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
              {remedy.name}
            </h1>
            {remedy.scientific_name && (
              <p className="text-xl text-primary font-semibold italic">
                {remedy.scientific_name}
              </p>
            )}

            {/* Featured Image */}
            {remedy.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mt-2 group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <Image
                  src={remedy.image}
                  alt={remedy.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            )}
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Description */}
            {remedy.description && (
              <section>
                <h3 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    description
                  </span>
                  Description
                </h3>
                <div className="space-y-4 text-on-surface/60 leading-relaxed break-words">
                  <p className="whitespace-pre-line break-all sm:break-words">{remedy.description}</p>
                </div>
              </section>
            )}

            {/* Preparation */}
            {preparationSteps.length > 0 && (
              <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
                <h3 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    skillet
                  </span>
                  How to Prepare
                </h3>
                <div className="space-y-6">
                  {preparationSteps.map((step, i) => (
                    <div key={step.title}>
                      {i > 0 && (
                        <div className="w-px h-6 bg-outline-variant/20 ml-4 mb-4" />
                      )}
                      <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface text-lg">
                            {step.title}
                          </h4>
                          <p className="text-on-surface/50 text-sm mt-1">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Usage Instructions */}
            {(remedy.dosage || remedy.duration) && (
              <section>
                <h3 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    medication
                  </span>
                  Usage Instructions
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {remedy.dosage && (
                    <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/10">
                      <h4 className="font-bold text-on-surface mb-2 text-sm uppercase tracking-wider">
                        Dosage
                      </h4>
                      <p className="text-on-surface/60">{remedy.dosage}</p>
                    </div>
                  )}
                  {remedy.duration && (
                    <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/10">
                      <h4 className="font-bold text-on-surface mb-2 text-sm uppercase tracking-wider">
                        Duration
                      </h4>
                      <p className="text-on-surface/60">{remedy.duration}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Treats Conditions */}
            {conditions.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    healing
                  </span>
                  Treats Conditions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {conditions.map((condition) => (
                    <Link
                      key={condition.slug}
                      href={`/conditions/${condition.slug}`}
                      className="group flex items-center gap-3 px-5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <span className="text-on-surface font-medium text-sm">
                        {condition.name}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface/40 group-hover:text-primary">
                        arrow_forward
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ── Right Column: Sidebar ── */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Safety Precautions */}
          {precautions.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-amber-700">
                <span className="material-symbols-outlined font-bold">
                  warning
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest">
                  Safety Precautions
                </h3>
              </div>
              <ul className="space-y-4 text-sm text-on-surface/70">
                {precautions.map((precaution) => (
                  <li key={precaution} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-amber-500 text-lg shrink-0">
                      check_circle
                    </span>
                    <span className="font-medium">{precaution}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-amber-200/50">
                <p className="text-[11px] text-amber-800/70 leading-relaxed italic">
                  <strong>Medical Disclaimer:</strong> This content is for
                  informational purposes only and is not a substitute for
                  professional medical advice.
                </p>
              </div>
            </div>
          )}

          {/* Related Herbs */}
          {relatedHerbs.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface mb-4">
                Related Herbs
              </h3>
              <div className="flex flex-col gap-4">
                {relatedHerbs.map((herb) => (
                  <Link
                    key={herb.slug}
                    href={`/remedies/${herb.slug}`}
                    className="group flex gap-3 items-center p-2 -mx-2 hover:bg-surface-container-low rounded-lg transition-colors"
                  >
                    {herb.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-low">
                        <Image
                          src={herb.image}
                          alt={herb.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
                        {herb.name}
                      </span>
                      <span className="text-xs text-on-surface/40">
                        {herb.scientific}
                      </span>
                      <span className="text-xs text-primary mt-1">
                        {herb.tag}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}
