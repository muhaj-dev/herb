"use client";

import Link from "next/link";
import { useState } from "react";

const faqItems = [
  {
    question: "What is HerbalWisdom?",
    answer:
      "HerbalWisdom is a comprehensive platform dedicated to preserving and sharing traditional herbal knowledge for modern wellness. We catalogue hundreds of botanicals, provide evidence-informed remedy guides, and connect people with certified herbalists. Our mission is to bridge the gap between ancient plant medicine traditions and contemporary health practices.",
  },
  {
    question: "Are herbal remedies safe?",
    answer:
      "When used responsibly and as directed, most herbal remedies have a long history of safe use. However, 'natural' does not automatically mean 'safe.' Dosage matters, individual health conditions vary, and some herbs can cause adverse reactions. We always recommend starting with small doses, monitoring your body's response, and consulting a healthcare professional — especially if you are pregnant, nursing, or managing a chronic condition.",
  },
  {
    question: "How do I know which remedy is right for me?",
    answer:
      "Choosing the right remedy depends on your specific health goals, constitution, and any existing conditions. We recommend browsing our conditions guide to find remedies matched to your needs. For personalized guidance, consider booking a consultation with one of our certified herbalists who can create a tailored protocol based on your unique health profile.",
  },
  {
    question: "Can I use herbal remedies with prescription medications?",
    answer:
      "This is one of the most important safety considerations in herbalism. Some herbs can interact with pharmaceutical drugs — for example, St. John's Wort can reduce the effectiveness of antidepressants and birth control, while garlic and ginkgo can amplify the effects of blood thinners. Always disclose your herbal supplement use to your doctor and pharmacist. Visit our Safety Guide for detailed interaction information.",
  },
  {
    question: "How long before I see results from herbal remedies?",
    answer:
      "Unlike conventional pharmaceuticals that often provide rapid symptomatic relief, herbal remedies typically work more gradually with the body's natural processes. Most protocols require 2 to 4 weeks of consistent use before significant changes are observed. Some adaptogens and tonic herbs may take 6 to 8 weeks to reach their full potential. Consistency and patience are key.",
  },
  {
    question: "Are your remedies FDA approved?",
    answer:
      "Herbal supplements are regulated by the FDA as dietary supplements, not as drugs. This means they are not subject to the same rigorous approval process as pharmaceuticals. Our information is provided for educational purposes only and has not been evaluated by the FDA. Our content is not intended to diagnose, treat, cure, or prevent any disease. We prioritize transparency and cite both traditional usage and available scientific research for every remedy we feature.",
  },
  {
    question: "How do I consult with an herbalist?",
    answer:
      "You can request a consultation through our Contact page by selecting 'Consultation Request' as the subject. Our certified clinical herbalists offer both in-person appointments at our Portland location and virtual sessions. During a typical consultation, the herbalist will review your health history, discuss your goals, and develop a personalized herbal protocol. Initial consultations usually last 60 to 90 minutes.",
  },
  {
    question: "Where do you source your herbs?",
    answer:
      "We are committed to 100% ethical sourcing. Our herbs come from a network of trusted organic farms, wildcrafters who practice sustainable harvesting, and fair-trade cooperatives around the world. We prioritize bioregional sourcing whenever possible and ensure that all suppliers meet our standards for ecological stewardship. A portion of our proceeds goes directly to regenerating native plant habitats.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
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
            help
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white font-bold mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-secondary-container text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about herbal remedies, our
            practices, and how we can support your wellness journey.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-24 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-secondary-muted font-sans text-xs uppercase tracking-widest block mb-2">
              Knowledge Base
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden transition-all duration-300 hover:shadow-ambient"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <h3 className="text-lg font-serif font-bold text-text-main pr-4">
                    {item.question}
                  </h3>
                  <span
                    className={`material-symbols-outlined text-primary shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-outline-variant/20 pt-4">
                        <p className="text-on-surface/60 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions - CTA */}
      <section className="py-20 px-4 gradient-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-5xl mb-6 opacity-80">
            contact_support
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 font-light">
            Our team of certified herbalists is ready to help with any questions
            not covered here. Reach out or review our safety guidelines.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-surface-container-low transition-colors shadow-lg"
            >
              Contact Us
            </Link>
            <Link
              href="/safety"
              className="px-8 py-3 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Safety Guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
