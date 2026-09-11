"use client";

import React from "react";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "../i18n/LanguageContext";
import { LOCALES, LOCALE_LABELS } from "../i18n/dictionaries";
import { cn } from "@/lib/utils";

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, dict } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={dict.common.languageSwitcherLabel}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 cursor-pointer"
      >
        <Languages className="w-3.5 h-3.5 text-brand-600" />
        <span>{LOCALE_LABELS[locale].code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={cn(l === locale && "bg-brand-50 text-brand-600 font-semibold")}
          >
            {LOCALE_LABELS[l].native}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
