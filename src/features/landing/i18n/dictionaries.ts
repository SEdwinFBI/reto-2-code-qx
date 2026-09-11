import type { Dictionary, Locale } from "./types";
import { es } from "./es";
import { qu } from "./qu";
import { en } from "./en";

export const LOCALES: Locale[] = ["es", "qu", "en"];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_STORAGE_KEY = "pnc-landing-locale";

export const dictionaries: Record<Locale, Dictionary> = { es, qu, en };

export const LOCALE_LABELS: Record<Locale, { code: string; native: string }> = {
  es: { code: "ES", native: "Español" },
  qu: { code: "K'I", native: "K'iche'" },
  en: { code: "EN", native: "English" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as string[]).includes(value);
}
