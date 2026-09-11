import type { Dictionary } from "./types";

export const es: Dictionary = {
  common: {
    nationalEmblemAlt: "Escudo Nacional de Guatemala",
    languageSwitcherLabel: "Cambiar idioma",
  },
  header: {
    title: "Exoneración de Multas de Tránsito",
    subtitle: "Policía Nacional Civil · Guatemala C.A.",
    solicitudButton: "Llenar solicitud de exoneración",
    chatButton: "Chatear con el Asistente",
    chatButtonShort: "Asistente",
  },
  hero: {
    eyebrow: "Acuerdo Gubernativo 59-2012",
    headingLine1: "¿Tu licencia venció por fuerza mayor?",
    headingLine2: "No pagues la multa: exonérala al 100%.",
    subtitle:
      "Averigua en **en menos de 2 minutos** si tu caso califica por ley, la casilla exacta a marcar en el **Formulario DT-AJ-001** y los documentos que necesitas llevar a ventanilla.",
    stat1Value: "Q0.00",
    stat1Caption: "Costo del trámite",
    stat2Value: "Hasta Q300",
    stat2Caption: "Ahorro en multa",
    stat3Value: "20 Días",
    stat3Caption: "Plazo legal resolución",
    calloutTitle: "Llenar Solicitud en Línea",
    calloutBadge: "Nuevo",
    calloutDescription: "Ingresa tu CUI, datos personales y adjunta tus 3 requisitos digitales.",
    ctaButton: "Iniciar Trámite",
  },
  causales: {
    eyebrow: "BASE LEGAL 59-2012",
    heading: "Las 3 Causales Aprobadas por Ley",
    subheading:
      "Si tu caso encaja en alguna de estas 3 situaciones, tienes derecho legal a solicitar el descargo del 100%.",
    requisitoLabel: "Requisito clave:",
    codigoLabel: "Código GAE:",
    items: [
      {
        casillaLabel: "Casilla 25",
        title: "Enfermedad o Accidente",
        description:
          "Haber sufrido hospitalización, reposo prescrito o impedimento físico que impidió presentarse a renovar.",
        requisito: "Certificación médica original del IGSS, red pública o médico colegiado activo.",
      },
      {
        casillaLabel: "Casilla 24",
        title: "Estar Fuera del País",
        description:
          "Haberse encontrado fuera del territorio guatemalteco al momento exacto en que caducó la vigencia de la licencia.",
        requisito: "Certificación de Movimiento Migratorio (IGM) o pasaporte con sellos legibles.",
      },
      {
        casillaLabel: "Casilla 26",
        title: "Privado de Libertad",
        description:
          "Haber permanecido en prisión preventiva o en cumplimiento de condena penal durante el vencimiento.",
        requisito: "Certificación de la Dirección General del Sistema Penitenciario o Juzgado ejecutor.",
      },
    ],
  },
  pasos: {
    eyebrow: "PROCEDIMIENTO DIRECTO",
    heading: "Cómo tramitar tu exoneración en 3 pasos",
    subheading: "Un trámite administrativo directo, presencial y sin cobro alguno.",
    items: [
      {
        titulo: "Descarga y llena el formulario",
        descripcion:
          "Imprime el **Formulario DT-AJ-001**. Marca la casilla correspondiente (24, 25 o 26) y fírmalo.",
      },
      {
        titulo: "Junta tus 3 documentos",
        descripcion:
          "Solo necesitas: **1)** Formulario firmado, **2)** Fotocopia de DPI de ambos lados, **3)** Comprobante oficial de fechas (médico, migratorio o penal).",
      },
      {
        titulo: "Entrégalos en ventanilla",
        descripcion:
          "Preséntalos en la Sección de Asuntos Jurídicos del Tránsito PNC. Te entregarán tu contraseña de seguimiento. **Resolución en 20 días hábiles.**",
      },
    ],
  },
  sedes: {
    eyebrow: "DEPARTAMENTO DE TRÁNSITO PNC",
    heading: "Encuentra una sede cerca de ti",
    gpsButtonLoading: "Obteniendo ubicación…",
    gpsButtonUpdate: "Actualizar mi ubicación",
    gpsButtonUse: "Usar mi ubicación",
    statusUnavailable:
      "La ubicación no está disponible en este navegador. Puedes explorar las oficinas directamente en el mapa.",
    statusDenied:
      "No se autorizó el acceso a tu ubicación. Habilita el permiso para buscar cerca de ti o explora el mapa.",
    statusGenericError: "No pudimos obtener tu ubicación. Inténtalo de nuevo o explora el mapa.",
    statusLocating: "Autoriza el acceso a tu ubicación en el navegador para buscar oficinas cerca de ti.",
    statusActive: "Búsqueda de oficinas del Departamento de Tránsito PNC cerca de tu ubicación.",
    statusIdle: "Permite el acceso a tu ubicación para buscar oficinas cercanas en Google Maps.",
    mapTitle: "Buscar oficinas del Departamento de Tránsito PNC en Google Maps",
    footerNote: "Para la exoneración, consulta la atención de Asuntos Jurídicos antes de acudir a una oficina.",
    infoLinkLabel: "Información oficial",
    openMapsLinkLabel: "Abrir en Google Maps",
  },
  faq: {
    heading: "Preguntas frecuentes",
    items: [
      {
        question: "¿Puedo pagar primero la multa en MAYCOM y pedir reembolso después?",
        answer:
          "!!No.!! Bajo el marco legal vigente del Departamento de Tránsito PNC, una vez pagada la multa en las agencias de emisión de licencias (MAYCOM) o entidades bancarias, el pago se considera legalmente consentido y definitivo. No existe procedimiento de reembolso o devolución retroactiva. Por tanto, si tu caso clasifica por fuerza mayor, debes tramitar y obtener tu resolución favorable de exoneración __antes__ de efectuar cualquier pago.",
      },
      {
        question: "¿Qué hago si mi licencia tiene menos de 30 días de vencida?",
        answer:
          "Si tu licencia de conducir tiene menos de 30 días calendario de vencimiento, debes acudir directamente a cualquier centro de emisión de licencias MAYCOM para tramitar tu renovación ordinaria. Las sanciones administrativas por extemporaneidad aplican al superar los plazos reglamentarios. Si tu vencimiento se produjo durante un impedimento de fuerza mayor (médico, migratorio o judicial), puedes solicitar la exoneración en cualquier momento presentando las pruebas correspondientes.",
      },
      {
        question: "¿Puede un familiar llevar mis papeles si no puedo viajar a la capital?",
        answer:
          "__Sí.__ Un familiar o tercero debidamente autorizado puede radicar el expediente en la Sección de Asuntos Jurídicos de Tránsito PNC. Para ello debe presentar:\n1) Carta poder o autorización legalizada ante notario activo.\n2) Fotocopia legible del DPI del titular de la licencia y del mandatario/familiar.\n3) El Formulario DT-AJ-001 debidamente firmado y los 3 requisitos de prueba de la causal.",
      },
      {
        question: "¿Cuánto tiempo tiene la Sección de Asuntos Jurídicos para emitir resolución?",
        answer:
          "De conformidad con el procedimiento administrativo y el Acuerdo Gubernativo 59-2012, la Sección de Asuntos Jurídicos tiene un plazo legal de ##20 días hábiles## a partir de la entrega del expediente completo con su contraseña de recepción.",
      },
      {
        question: "¿Tiene algún costo este trámite de exoneración?",
        answer:
          "__Absolutamente ninguno.__ El trámite de solicitud de descargo y exoneración de multa por fuerza mayor ante el Departamento de Tránsito de la Policía Nacional Civil es ++100% gratuito++. Ningún funcionario o particular está autorizado a cobrar por este servicio.",
      },
    ],
  },
  footer: {
    institution: "Departamento de Tránsito de la Policía Nacional Civil",
    legal: "República de Guatemala · Marco normativo Acuerdo Gubernativo 59-2012",
    badge: "Trámite Oficial Gratuito",
  },
  kicheDisclaimer: "",
};
