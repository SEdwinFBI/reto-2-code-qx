"use client";

import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { RichText } from "../i18n/RichText";

export const PasosSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold-800 tracking-wider uppercase mb-2 block">
            {dict.pasos.eyebrow}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-3">
            {dict.pasos.heading}
          </h3>
          <p className="text-sm sm:text-base text-slate-600">{dict.pasos.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {dict.pasos.items.map((p, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow relative flex flex-col"
            >
              {/* Number Badge */}
              <div className="font-display w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-base mb-5 shadow-xs">
                {index + 1}
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                {p.titulo}
              </h4>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <RichText text={p.descripcion} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
