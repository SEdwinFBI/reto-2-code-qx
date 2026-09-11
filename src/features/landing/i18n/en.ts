import type { Dictionary } from "./types";

export const en: Dictionary = {
  common: {
    nationalEmblemAlt: "National Emblem of Guatemala",
    languageSwitcherLabel: "Change language",
  },
  header: {
    title: "Traffic Fine Exoneration",
    subtitle: "National Civil Police · Guatemala",
    solicitudButton: "Fill out exoneration request",
    chatButton: "Chat with the Assistant",
    chatButtonShort: "Assistant",
  },
  hero: {
    eyebrow: "Governmental Agreement 59-2012",
    headingLine1: "Did your license expire due to force majeure?",
    headingLine2: "Don't pay the fine: get it 100% exonerated.",
    subtitle:
      "Find out in **under 2 minutes** whether your case qualifies by law, the exact box to check on **Form DT-AJ-001**, and the documents you need to bring to the counter.",
    stat1Value: "Q0.00",
    stat1Caption: "Procedure cost",
    stat2Value: "Up to Q300",
    stat2Caption: "Fine savings",
    stat3Value: "20 Days",
    stat3Caption: "Legal resolution deadline",
    calloutTitle: "Fill Out the Request Online",
    calloutBadge: "New",
    calloutDescription: "Enter your CUI, personal details, and attach your 3 digital requirements.",
    ctaButton: "Start Request",
  },
  causales: {
    eyebrow: "LEGAL BASIS 59-2012",
    heading: "The 3 Grounds Approved by Law",
    subheading:
      "If your case matches one of these 3 situations, you have the legal right to request a 100% discharge.",
    requisitoLabel: "Key requirement:",
    codigoLabel: "GAE Code:",
    items: [
      {
        casillaLabel: "Box 25",
        title: "Illness or Accident",
        description:
          "Having been hospitalized, under prescribed rest, or physically unable to appear to renew.",
        requisito: "Original medical certification from IGSS, the public health network, or a licensed physician.",
      },
      {
        casillaLabel: "Box 24",
        title: "Being Outside the Country",
        description:
          "Having been outside Guatemalan territory at the exact moment the license's validity expired.",
        requisito: "Migratory Movement Certification (IGM) or a passport with legible stamps.",
      },
      {
        casillaLabel: "Box 26",
        title: "Deprived of Liberty",
        description: "Having been in pretrial detention or serving a criminal sentence during the expiration.",
        requisito: "Certification from the General Directorate of the Penitentiary System or the presiding court.",
      },
    ],
  },
  pasos: {
    eyebrow: "DIRECT PROCEDURE",
    heading: "How to Process Your Exoneration in 3 Steps",
    subheading: "A direct, in-person administrative procedure with no charge whatsoever.",
    items: [
      {
        titulo: "Download and fill out the form",
        descripcion:
          "Print **Form DT-AJ-001**. Check the corresponding box (24, 25, or 26) and sign it.",
      },
      {
        titulo: "Gather your 3 documents",
        descripcion:
          "You only need: **1)** the signed form, **2)** a photocopy of both sides of your DPI, **3)** official proof of dates (medical, migratory, or judicial).",
      },
      {
        titulo: "Submit them at the counter",
        descripcion:
          "Present them at the Legal Affairs Section of PNC Traffic. You'll receive your tracking password. **Resolution within 20 business days.**",
      },
    ],
  },
  sedes: {
    eyebrow: "PNC TRAFFIC DEPARTMENT",
    heading: "Find an Office Near You",
    gpsButtonLoading: "Getting location…",
    gpsButtonUpdate: "Update my location",
    gpsButtonUse: "Use my location",
    statusUnavailable:
      "Location isn't available in this browser. You can browse the offices directly on the map.",
    statusDenied:
      "Access to your location wasn't authorized. Enable the permission to search near you, or browse the map.",
    statusGenericError: "We couldn't get your location. Try again, or browse the map.",
    statusLocating: "Authorize location access in your browser to search for offices near you.",
    statusActive: "Searching for PNC Traffic Department offices near your location.",
    statusIdle: "Allow location access to search for nearby offices on Google Maps.",
    mapTitle: "Search PNC Traffic Department offices on Google Maps",
    footerNote: "For the exoneration, check with the Legal Affairs desk before visiting an office.",
    infoLinkLabel: "Official information",
    openMapsLinkLabel: "Open in Google Maps",
  },
  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "Can I pay the fine at MAYCOM first and request a refund later?",
        answer:
          "!!No.!! Under the current legal framework of the PNC Traffic Department, once a fine is paid at license-issuing agencies (MAYCOM) or banks, the payment is considered legally accepted and final. There is no refund or retroactive reimbursement procedure. So, if your case qualifies as force majeure, you must process and obtain your favorable exoneration ruling __before__ making any payment.",
      },
      {
        question: "What should I do if my license expired less than 30 days ago?",
        answer:
          "If your driver's license expired less than 30 calendar days ago, you should go directly to any MAYCOM license-issuing center to process your regular renewal. Administrative penalties for lateness apply once regulatory deadlines are exceeded. If your expiration occurred during a force majeure impediment (medical, migratory, or judicial), you may request the exoneration at any time by presenting the corresponding evidence.",
      },
      {
        question: "Can a family member bring my paperwork if I can't travel to the capital?",
        answer:
          "__Yes.__ A duly authorized family member or third party may file the case at the Legal Affairs Section of PNC Traffic. To do so, they must present:\n1) A power of attorney or authorization notarized by an active notary.\n2) A legible photocopy of the DPI of both the license holder and the representative/family member.\n3) Form DT-AJ-001 duly signed, plus the 3 supporting documents for the ground being claimed.",
      },
      {
        question: "How long does the Legal Affairs Section have to issue a ruling?",
        answer:
          "In accordance with the administrative procedure and Governmental Agreement 59-2012, the Legal Affairs Section has a legal deadline of ##20 business days## from the delivery of the complete case file with its receipt password.",
      },
      {
        question: "Does this exoneration procedure have any cost?",
        answer:
          "__Absolutely none.__ The request for discharge and exoneration of a fine due to force majeure before the Traffic Department of the National Civil Police is ++100% free of charge++. No official or private individual is authorized to charge for this service.",
      },
    ],
  },
  footer: {
    institution: "Traffic Department of the National Civil Police",
    legal: "Republic of Guatemala · Regulatory framework: Governmental Agreement 59-2012",
    badge: "Free Official Procedure",
  },
  kicheDisclaimer: "",
};
