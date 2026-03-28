import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety Guide - HerbalWisdom",
  description:
    "Essential safety guidelines for using herbal remedies responsibly. Learn about interactions, dosage, and when to consult a professional.",
};

export default function SafetyGuidePage() {
  return (
    <>
      {/* ── Hero Section with Image Background ── */}
      <section className="relative h-[400px] md:h-[614px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKGlRMEicvUrTxzzPfd3uk1lghfqAfbJQ_78Vt-Oy-DUmdbHog2BVrgEyUJHE1zDjtEFcL2Y0H3PtwR0XtsheayaYHJJ49Qc6hWDu8C41XdE4JDmoMht01_gVWrPS5iygGLjAhqgmXGF0TuzNKtwdzhJUuHWwIonut9MdkJFXsn8r4ZWipS_jq51IJMelRXaAxuzC2IJrRR4Zo1HVNGaM5Nu-R-T3Hbx6cgKYw6dhAEnYbibayQsdlBcBbzjxhZaigeBKNiLJ8DJw"
            alt="Overhead view of dried botanical herbs and flowers on a dark textured surface"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 to-primary-dark/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white font-bold mb-6 tracking-tight">
            Herbal Safety &amp; Guidelines
          </h1>
          <p className="text-secondary-container text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between ancient botanical wisdom and modern clinical
            safety for your holistic well-being.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
        {/* ── General Safety Principles - Bento Style ── */}
        <section>
          <div className="mb-8 md:mb-12">
            <span className="text-secondary-muted font-sans text-xs uppercase tracking-widest block mb-2">
              Foundations
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary">
              General Safety Principles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Large card */}
            <div className="md:col-span-2 bg-surface-container-low p-8 md:p-10 rounded-xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block">
                  science
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-4">
                  Precision in Dosage
                </h3>
                <p className="text-on-surface/60 leading-relaxed mb-6">
                  Traditional remedies are chemical compounds. The difference
                  between a remedy and a toxin often lies in the dosage. Always
                  follow prescribed measurements and avoid the misconception that
                  &quot;natural&quot; means &quot;unlimited.&quot;
                </p>
              </div>
              <div className="flex items-center gap-4 py-4 border-t border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary-muted">
                  info
                </span>
                <p className="text-sm font-medium italic text-secondary-muted">
                  Never exceed 3 doses within a 24-hour period unless specified.
                </p>
              </div>
            </div>
            {/* Dark accent card */}
            <div className="bg-primary text-white p-8 md:p-10 rounded-xl">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-6 block">
                update
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-4">
                Consistency &amp; Cycle
              </h3>
              <p className="text-secondary-container text-sm leading-relaxed mb-8">
                Herbal support works with the body&apos;s natural rhythms. Most
                protocols require 2–4 weeks of consistent use before significant
                changes are observed.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xs">
                    check_circle
                  </span>
                  Use at the same time daily
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xs">
                    check_circle
                  </span>
                  Observe 1 week rest every month
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Specific Precautions - Asymmetric Layout ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <img
              className="rounded-xl shadow-2xl w-full aspect-[4/5] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWKAzNnf7R8V1XRickuE__yrjP_98YLyaE9bUp9MKbLK08kiuazDJtgvGuKhlE3YlGSwxBWUqu7ni1lSLmgZqRzhC6H8_iZD3kbsFiI9NAL5mRWYJ7EhkCOue0EZNGklwW5t6GqxCFqF4x6DVeBOikDWGTI2uhitd7XuZA20N5w05Esw8IaYnId40IWlubortxj9j_2mKcQvqF3DKJe9pyuMqhYHHYoj273qB7_T5qEPiMrytJaCwtosyc5_OywPfjnqY7hSLEe8M"
              alt="Glass apothecary jar filled with green medicinal herbs on a light wooden table"
            />
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <span className="text-secondary-muted font-sans text-xs uppercase tracking-widest block mb-2">
              Vulnerable Groups
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-8">
              Specific Precautions
            </h2>
            <div className="space-y-10 md:space-y-12">
              {[
                {
                  icon: "pregnant_woman",
                  title: "Pregnancy & Breastfeeding",
                  desc: "Many common herbs like goldenseal or juniper can stimulate uterine contractions. Consult with your midwife or physician before any botanical introduction during these critical phases.",
                },
                {
                  icon: "child_care",
                  title: "Pediatric Care",
                  desc: "Children's metabolisms are significantly different. Dosages must be adjusted based on weight, not age, and certain essential oils should never be ingested by those under 12.",
                },
                {
                  icon: "health_and_safety",
                  title: "Chronic Conditions",
                  desc: "If you have underlying kidney or liver dysfunction, the processing of herbal compounds can place additional strain on these organs.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-5 md:gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-primary mb-2">
                      {item.title}
                    </h4>
                    <p className="text-on-surface/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pharmaceutical Interactions - Glass Card ── */}
        <section className="bg-surface-container-low rounded-2xl p-6 md:p-12 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary-container rounded-full blur-[100px] opacity-30" />
          <div className="relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                Pharmaceutical Interactions
              </h2>
              <p className="text-on-surface/60 max-w-2xl mx-auto">
                Herbs can significantly alter how pharmaceutical drugs are
                metabolized by the liver, potentially leading to toxic buildup or
                reduced efficacy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="glass bg-white/85 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/50">
                <div className="flex items-center gap-3 mb-6 text-red-600">
                  <span className="material-symbols-outlined">warning</span>
                  <h4 className="font-bold uppercase tracking-wider text-sm">
                    Critical Warning: Blood Thinners
                  </h4>
                </div>
                <p className="text-on-surface/60 text-sm mb-4">
                  Herbs such as Garlic, Ginkgo, and Ginger can thin the blood.
                  Combining these with prescriptions like Warfarin increases risk
                  of internal bleeding.
                </p>
              </div>
              <div className="glass bg-white/85 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/50">
                <div className="flex items-center gap-3 mb-6 text-primary-dark">
                  <span className="material-symbols-outlined">psychiatry</span>
                  <h4 className="font-bold uppercase tracking-wider text-sm">
                    Mental Health Medications
                  </h4>
                </div>
                <p className="text-on-surface/60 text-sm mb-4">
                  St. John&apos;s Wort is a potent inducer of liver enzymes and
                  can render antidepressants, birth control, and heart
                  medications ineffective.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── When to Seek Clinical Advice - Dark CTA ── */}
        <section className="bg-primary-container text-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 p-8 md:p-12 lg:p-20">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-5xl mb-6 md:mb-8 leading-tight">
              When to Seek Clinical Advice
            </h2>
            <p className="text-secondary-container/90 text-base md:text-lg mb-8 md:mb-12">
              Botanical medicine is a supportive modality, not a replacement for
              emergency care. If you experience sudden onset symptoms, difficulty
              breathing, or allergic reactions, seek immediate medical attention.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link
                href="/about"
                className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold hover:bg-secondary-container transition-colors"
              >
                Book Specialist Consultation
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
              >
                Emergency Protocols
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-primary p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10">
            <h4 className="font-serif text-xl mb-6">Medical Disclaimer</h4>
            <p className="text-xs text-secondary-container/70 leading-relaxed uppercase tracking-widest">
              Information provided is for educational purposes only and has not
              been evaluated by the FDA. This product is not intended to
              diagnose, treat, cure, or prevent any disease. Always consult your
              healthcare provider.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
