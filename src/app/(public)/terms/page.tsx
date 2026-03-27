import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions and Medical Disclaimer - HerbalWisdom",
  description:
    "Legal terms, medical disclaimer, and privacy policy for using the HerbalWisdom platform.",
};

const sidebarLinks = [
  { id: "medical-disclaimer", icon: "medical_services", label: "Medical Disclaimer" },
  { id: "terms-of-use", icon: "description", label: "Terms of Use" },
  { id: "privacy-policy", icon: "lock", label: "Privacy Policy" },
  { id: "intellectual-property", icon: "copyright", label: "Intellectual Property" },
  { id: "contact", icon: "mail", label: "Contact Us" },
];

export default function TermsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm">gavel</span>
            Legal Information
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            Terms &amp; Conditions and
            <br />
            Medical Disclaimer
          </h1>
          <p className="text-lg text-on-surface/50 max-w-2xl mx-auto">
            Please read these terms carefully before using HerbalWisdom. Your
            health and safety are our priority, but our content is for
            informational purposes only.
          </p>
          <div className="mt-8 text-sm text-on-surface/40">
            Last Updated: March 25, 2026
          </div>
        </div>
      </section>

      {/* ── Content with Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav aria-label="Sidebar" className="space-y-1">
                {sidebarLinks.map((link, i) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-colors ${
                      i === 0
                        ? "bg-primary/10 text-primary border-primary"
                        : "text-on-surface/50 hover:bg-surface-container-low hover:text-on-surface border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg mr-3">
                      {link.icon}
                    </span>
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-sm">
                <h4 className="font-bold text-on-surface mb-2 text-sm">
                  Need professional help?
                </h4>
                <p className="text-xs text-on-surface/40 mb-4">
                  While we provide information, nothing replaces a certified
                  practitioner.
                </p>
                <button className="w-full py-2 px-4 bg-surface border border-outline-variant/20 rounded-lg text-sm font-semibold text-on-surface/70 hover:bg-surface-container-low transition-colors">
                  Find a Practitioner
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl space-y-12">
            {/* Medical Disclaimer */}
            <section className="scroll-mt-24" id="medical-disclaimer">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
                <span className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <span className="material-symbols-outlined">warning</span>
                </span>
                <h2 className="text-2xl font-bold text-on-surface">
                  Medical Disclaimer
                </h2>
              </div>
              <div className="text-on-surface/60 leading-relaxed space-y-4">
                <p className="font-medium text-on-surface">
                  THIS WEBSITE DOES NOT PROVIDE MEDICAL ADVICE.
                </p>
                <p>
                  The information, including but not limited to, text, graphics,
                  images and other material contained on this website are for
                  informational purposes only. No material on this site is
                  intended to be a substitute for professional medical advice,
                  diagnosis or treatment.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
                  <p className="text-sm text-amber-800 font-medium">
                    <span className="material-symbols-outlined align-middle mr-1 text-lg">
                      info
                    </span>
                    Always seek the advice of your physician or other qualified
                    health care provider with any questions you may have
                    regarding a medical condition or treatment and before
                    undertaking a new health care regimen, and never disregard
                    professional medical advice or delay in seeking it because of
                    something you have read on this website.
                  </p>
                </div>
                <p>
                  <strong className="text-on-surface">
                    Herbal Supplements:
                  </strong>{" "}
                  Information regarding herbal supplements has not been evaluated
                  by the Food and Drug Administration and is not intended to
                  diagnose, treat, cure, or prevent any disease.
                </p>
                <p>
                  If you think you may have a medical emergency, call your
                  doctor, go to the emergency department, or call emergency
                  services immediately. HerbalWisdom does not recommend or
                  endorse any specific tests, physicians, products, procedures,
                  opinions, or other information that may be mentioned on this
                  website. Reliance on any information provided by HerbalWisdom,
                  HerbalWisdom employees, contracted writers, or medical
                  professionals presenting content for publication to
                  HerbalWisdom is solely at your own risk.
                </p>
              </div>
            </section>

            {/* Terms of Use */}
            <section
              className="scroll-mt-24 pt-8 border-t border-outline-variant/10"
              id="terms-of-use"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined">gavel</span>
                </span>
                <h2 className="text-2xl font-bold text-on-surface">
                  Terms of Use
                </h2>
              </div>
              <div className="text-on-surface/60 leading-relaxed space-y-4">
                <h3 className="text-lg font-bold text-on-surface">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing and using this website, you accept and agree to be
                  bound by the terms and provision of this agreement. In
                  addition, when using this website&apos;s particular services,
                  you shall be subject to any posted guidelines or rules
                  applicable to such services.
                </p>

                <h3 className="text-lg font-bold text-on-surface">
                  2. Use License
                </h3>
                <p>
                  Permission is granted to temporarily download one copy of the
                  materials (information or software) on HerbalWisdom&apos;s
                  website for personal, non-commercial transitory viewing only.
                  This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>modify or copy the materials;</li>
                  <li>
                    use the materials for any commercial purpose, or for any
                    public display (commercial or non-commercial);
                  </li>
                  <li>
                    attempt to decompile or reverse engineer any software
                    contained on HerbalWisdom&apos;s website;
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials; or
                  </li>
                  <li>
                    transfer the materials to another person or
                    &quot;mirror&quot; the materials on any other server.
                  </li>
                </ul>

                <h3 className="text-lg font-bold text-on-surface">
                  3. User Conduct
                </h3>
                <p>
                  You agree to use the website only for lawful purposes. You are
                  prohibited from posting on or transmitting through the website
                  any material that is unlawful, harmful, threatening, abusive,
                  harassing, defamatory, vulgar, obscene, sexually explicit,
                  profane, hateful, racially, ethnically, or otherwise
                  objectionable.
                </p>

                <h3 className="text-lg font-bold text-on-surface">
                  4. Limitation of Liability
                </h3>
                <p>
                  In no event shall HerbalWisdom or its suppliers be liable for
                  any damages (including, without limitation, damages for loss of
                  data or profit, or due to business interruption) arising out of
                  the use or inability to use the materials on HerbalWisdom&apos;s
                  website, even if HerbalWisdom or a HerbalWisdom authorized
                  representative has been notified orally or in writing of the
                  possibility of such damage.
                </p>

                <h3 className="text-lg font-bold text-on-surface">
                  5. Governing Law
                </h3>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws of the jurisdiction in which
                  HerbalWisdom Inc. is registered, without regard to its conflict
                  of law provisions.
                </p>
              </div>
            </section>

            {/* Privacy Policy */}
            <section
              className="scroll-mt-24 pt-8 border-t border-outline-variant/10"
              id="privacy-policy"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <span className="material-symbols-outlined">security</span>
                </span>
                <h2 className="text-2xl font-bold text-on-surface">
                  Privacy Policy
                </h2>
              </div>
              <div className="text-on-surface/60 leading-relaxed space-y-4">
                <p>
                  Your privacy is very important to us. Accordingly, we have
                  developed this Policy in order for you to understand how we
                  collect, use, communicate and disclose and make use of personal
                  information.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded-xl">
                    <h4 className="font-bold text-on-surface mb-2">
                      What we collect
                    </h4>
                    <ul className="text-sm space-y-2">
                      {[
                        "Email addresses for newsletters",
                        "Usage data and cookies",
                        "Account preferences",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                            check_circle
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded-xl">
                    <h4 className="font-bold text-on-surface mb-2">
                      How we use it
                    </h4>
                    <ul className="text-sm space-y-2">
                      {[
                        "To improve our website content",
                        "To send periodic emails",
                        "To personalize your experience",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                            check_circle
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p>
                  We are committed to conducting our business in accordance with
                  these principles in order to ensure that the confidentiality of
                  personal information is protected and maintained.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section
              className="scroll-mt-24 pt-8 border-t border-outline-variant/10"
              id="intellectual-property"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <span className="material-symbols-outlined">copyright</span>
                </span>
                <h2 className="text-2xl font-bold text-on-surface">
                  Intellectual Property
                </h2>
              </div>
              <div className="text-on-surface/60 leading-relaxed space-y-4">
                <p>
                  All content on HerbalWisdom, including text, images, graphics,
                  logos, icons, audio clips, digital downloads, data
                  compilations, and software, is the property of HerbalWisdom
                  Inc. or its content suppliers and is protected by international
                  copyright laws.
                </p>
                <p>
                  The compilation of all content on this site is the exclusive
                  property of HerbalWisdom Inc. and is protected by international
                  copyright laws. All software used on this site is the property
                  of HerbalWisdom Inc. or its software suppliers and is protected
                  by international copyright laws.
                </p>
                <p>
                  HerbalWisdom&apos;s trademarks and trade dress may not be used
                  in connection with any product or service that is not
                  HerbalWisdom&apos;s, in any manner that is likely to cause
                  confusion among customers, or in any manner that disparages or
                  discredits HerbalWisdom.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section
              className="scroll-mt-24 pt-8 border-t border-outline-variant/10"
              id="contact"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                  <span className="material-symbols-outlined">mail</span>
                </span>
                <h2 className="text-2xl font-bold text-on-surface">
                  Contact Us
                </h2>
              </div>
              <div className="text-on-surface/60 leading-relaxed space-y-4">
                <p>
                  If you have any questions about these Terms &amp; Conditions,
                  Privacy Policy, or Medical Disclaimer, please contact us:
                </p>
                <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      mail
                    </span>
                    <span>
                      <strong className="text-on-surface">Email:</strong>{" "}
                      <a
                        href="mailto:legal@herbalwisdom.com"
                        className="text-primary hover:underline"
                      >
                        legal@herbalwisdom.com
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    <span>
                      <strong className="text-on-surface">Address:</strong>{" "}
                      HerbalWisdom Inc., 123 Botanical Lane, Portland, OR 97201
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      phone
                    </span>
                    <span>
                      <strong className="text-on-surface">Phone:</strong>{" "}
                      +1 (503) 555-0142
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <section className="py-16 px-4 bg-primary/5 border-t border-outline-variant/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">help</span>
          </div>
          <h2 className="text-3xl font-bold text-on-surface mb-4">
            Still have questions?
          </h2>
          <p className="text-on-surface/50 mb-8 max-w-lg mx-auto">
            If you cannot find the answer to your question in our Terms &amp;
            Conditions or Privacy Policy, please contact our support team.
          </p>
          <button className="bg-primary text-on-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Contact Support
          </button>
        </div>
      </section>
    </>
  );
}
