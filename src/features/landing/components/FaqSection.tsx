"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "../i18n/LanguageContext";
import { RichText } from "../i18n/RichText";

export const FaqSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            {dict.faq.heading}
          </h3>
        </div>

        <div className="space-y-3.5">
          {dict.faq.items.map((faq, index) => (
            <Accordion
              key={index}
              defaultValue={index === 0 ? ["faq"] : undefined}
              className="rounded-2xl border border-slate-200/80 bg-white px-5 shadow-sm transition-all hover:border-slate-300"
            >
              <AccordionItem value="faq" className="border-none">
                <AccordionTrigger className="py-5 text-base font-semibold text-slate-800 hover:text-brand-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                  <p>
                    <RichText text={faq.answer} />
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};
