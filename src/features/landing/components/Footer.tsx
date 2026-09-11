"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "../i18n/LanguageContext";

export const Footer: React.FC = () => {
  const { dict } = useLanguage();
  return (
    <footer className="bg-navy-900 text-white py-10 border-t border-navy-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Datos institucionales */}
          <div className="flex items-center gap-4">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-500/50 shrink-0 shadow-inner">
              <Image
                src="/images.jpg"
                alt={dict.common.nationalEmblemAlt}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <h5 className="font-display text-sm font-bold text-white tracking-tight">
                {dict.footer.institution}
              </h5>
              <p className="text-xs text-blue-200/70 mt-0.5">
                {dict.footer.legal}
              </p>
            </div>
          </div>

          {/* Distintivo legal */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gold-100 tracking-wide bg-navy-950/80 px-3 py-1.5 rounded-full border border-gold-500/30">
              {dict.footer.badge}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
