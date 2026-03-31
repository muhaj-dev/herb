"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { submitContactForm } from "@/lib/actions/contact-actions";

const contactInfo = [
  {
    icon: "mail",
    label: "Email",
    value: "hello@herbalwisdom.com",
    href: "mailto:hello@herbalwisdom.com",
  },
  {
    icon: "call",
    label: "Phone",
    value: "(503) 555-0142",
    href: "tel:+15035550142",
  },
  {
    icon: "location_on",
    label: "Address",
    value: "123 Botanical Lane, Portland, OR 97201",
    href: "https://maps.google.com/?q=123+Botanical+Lane+Portland+OR+97201",
  },
];

const subjects = [
  "General Inquiry",
  "Consultation Request",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/90 to-primary-container/80" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-secondary-container rounded-full blur-[120px] opacity-20" />
        <div className="absolute -left-24 -top-24 w-80 h-80 bg-primary rounded-full blur-[100px] opacity-15" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="material-symbols-outlined text-secondary-container text-5xl mb-4 block">
            forum
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white font-bold mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-secondary-container text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            We would love to hear from you. Whether you have a question about our
            remedies, need guidance, or want to collaborate — our team is here
            to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.icon === "location_on" ? "_blank" : undefined}
                rel={
                  item.icon === "location_on"
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 hover:shadow-ambient transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary-container flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">
                  {item.label}
                </h3>
                <p className="text-on-surface/60 leading-relaxed">
                  {item.value}
                </p>
              </a>
            ))}
          </div>

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Text */}
            <div className="lg:col-span-5">
              <span className="text-secondary-muted font-sans text-xs uppercase tracking-widest block mb-2">
                Send a Message
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">
                We Are Here to Help
              </h2>
              <p className="text-on-surface/60 leading-relaxed mb-8">
                Fill out the form and our team will get back to you within 24
                hours. For urgent matters, please call us directly.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-on-surface/50">
                  <span className="material-symbols-outlined text-primary">
                    schedule
                  </span>
                  <span className="text-sm">
                    Mon - Fri: 9:00 AM - 6:00 PM PST
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface/50">
                  <span className="material-symbols-outlined text-primary">
                    avg_pace
                  </span>
                  <span className="text-sm">
                    Average response time: under 4 hours
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">
                    error
                  </span>
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-secondary-container/50 border border-primary/20 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  <div>
                    <p className="font-bold text-primary text-sm">
                      Message Sent Successfully
                    </p>
                    <p className="text-on-surface/60 text-sm">
                      Thank you for reaching out. We will get back to you
                      shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="ml-auto text-on-surface/40 hover:text-on-surface/70 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                  </button>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="bg-surface-container-low p-8 md:p-10 rounded-xl border border-outline-variant/10 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-on-surface/70 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-on-surface/70 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-on-surface/70 mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-on-surface/70 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-3 gradient-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-accent/30 border-y border-primary/10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-4xl text-primary/60 mb-4">
            explore
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-main mb-6">
            Explore More
          </h2>
          <p className="text-on-surface/60 text-lg mb-10 max-w-xl mx-auto">
            Learn about our herbal remedies, safety guidelines, or the story
            behind HerbalWisdom.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/remedies"
              className="px-8 py-3 gradient-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg"
            >
              Browse Remedies
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 bg-transparent border-2 border-primary/30 text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-transparent border-2 border-primary/30 text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
