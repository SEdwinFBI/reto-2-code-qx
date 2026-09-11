export type Locale = "es" | "qu" | "en";

export interface CausalEntry {
  casillaLabel: string;
  title: string;
  description: string;
  requisito: string;
}

export interface PasoEntry {
  titulo: string;
  /** Admite formato enriquecido (RichText) */
  descripcion: string;
}

export interface FaqEntry {
  question: string;
  /** Admite formato enriquecido (RichText) */
  answer: string;
}

export interface Dictionary {
  common: {
    nationalEmblemAlt: string;
    languageSwitcherLabel: string;
  };
  header: {
    title: string;
    subtitle: string;
    solicitudButton: string;
    chatButton: string;
    chatButtonShort: string;
  };
  hero: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    /** Admite formato enriquecido (RichText) */
    subtitle: string;
    stat1Value: string;
    stat1Caption: string;
    stat2Value: string;
    stat2Caption: string;
    stat3Value: string;
    stat3Caption: string;
    calloutTitle: string;
    calloutBadge: string;
    calloutDescription: string;
    ctaButton: string;
  };
  causales: {
    eyebrow: string;
    heading: string;
    subheading: string;
    requisitoLabel: string;
    codigoLabel: string;
    items: [CausalEntry, CausalEntry, CausalEntry];
  };
  pasos: {
    eyebrow: string;
    heading: string;
    subheading: string;
    items: [PasoEntry, PasoEntry, PasoEntry];
  };
  sedes: {
    eyebrow: string;
    heading: string;
    gpsButtonLoading: string;
    gpsButtonUpdate: string;
    gpsButtonUse: string;
    statusUnavailable: string;
    statusDenied: string;
    statusGenericError: string;
    statusLocating: string;
    statusActive: string;
    statusIdle: string;
    mapTitle: string;
    footerNote: string;
    infoLinkLabel: string;
    openMapsLinkLabel: string;
  };
  faq: {
    heading: string;
    items: [FaqEntry, FaqEntry, FaqEntry, FaqEntry, FaqEntry];
  };
  footer: {
    institution: string;
    legal: string;
    badge: string;
  };
  /** Visible únicamente en la versión en K'iche'. */
  kicheDisclaimer: string;
}
