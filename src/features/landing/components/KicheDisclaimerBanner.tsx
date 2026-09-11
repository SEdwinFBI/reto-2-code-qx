"use client";

import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export const KicheDisclaimerBanner: React.FC = () => {
  const { locale, dict } = useLanguage();

  if (locale !== "qu") return null;

  return (
    <div className="w-full bg-gold-50 border-b border-gold-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-start gap-2">
        <Info className="w-4 h-4 text-gold-800 shrink-0 mt-0.5" />
        <p className="text-xs text-gold-800 leading-relaxed">{dict.kicheDisclaimer}</p>
      </div>
    </div>
  );
};
