"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Dictionary, Locale } from "./types";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, dictionaries, isLocale } from "./dictionaries";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always the default locale on the server and on first client render, so
  // SSR output and the pre-hydration DOM match — the stored preference (if
  // any) is applied post-mount, same pattern as
  // src/features/agent-chat/hooks/useSpeechRecognition.ts's isSupported flag.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // localStorage unavailable (private mode, etc.) — stay on the default locale.
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore — the choice just won't persist across reloads.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, dict: dictionaries[locale] }),
    [locale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
