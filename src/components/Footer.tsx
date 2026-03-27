import Link from "next/link";

const footerLinks = {
  Explore: [
    { href: "/remedies", label: "Browse Herbs" },
    { href: "/conditions", label: "Symptom Checker" },
    { href: "#", label: "Ayurveda" },
    { href: "#", label: "TCM" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "#", label: "Expert Board" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Contact" },
  ],
  Legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "#", label: "Medical Disclaimer" },
    { href: "#", label: "Cookie Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">spa</span>
              </div>
              <span className="text-xl font-serif font-bold text-on-surface">
                HerbalWisdom
              </span>
            </div>
            <p className="text-sm text-on-surface/50 mb-6 leading-relaxed">
              Connecting you with nature&apos;s pharmacy. Discover holistic
              healing traditions backed by modern research.
            </p>
            <div className="flex gap-4">
              {["public", "share", "rss_feed"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="text-on-surface/30 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold font-serif text-on-surface mb-6">
                {title}
              </h4>
              <ul className="space-y-3 text-sm text-on-surface/50">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface/40">
            &copy; {new Date().getFullYear()} HerbalWisdom Inc. All rights
            reserved.
          </p>
          <p className="text-xs text-on-surface/30 text-center md:text-right max-w-md italic">
            Disclaimer: Content is for informational purposes only and is not
            medical advice. Always consult a healthcare professional.
          </p>
        </div>
      </div>
    </footer>
  );
}
