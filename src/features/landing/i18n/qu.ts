import type { Dictionary } from "./types";

/**
 * K'iche' (Mayan language, Guatemala). This is an AI best-effort translation,
 * NOT a certified one — K'iche' is a low-resource language for AI, especially
 * for modern institutional/legal vocabulary. Spanish loanwords are kept
 * deliberately for terms with no established K'iche' equivalent (multa,
 * licencia, trámite, Acuerdo Gubernativo, GAE codes, form/office names), which
 * mirrors real Mayan-language government communication practice. A visible
 * on-page disclaimer (see `kicheDisclaimer` below) tells the reader this needs
 * review by a native speaker — do not remove that disclaimer without one.
 */
export const qu: Dictionary = {
  common: {
    nationalEmblemAlt: "Retal Amaq' Iximulew",
    languageSwitcherLabel: "Jalwachij tzij",
  },
  header: {
    title: "Q'exonik re Multa rech B'inibal",
    subtitle: "Ajchakib' Utzilal Amaq' · Iximulew",
    solicitudButton: "Tz'ib'aj ri kꞌutunik re q'exonik",
    chatButton: "Chattzijon rukꞌ ri Ajtoꞌl",
    chatButtonShort: "Ajtoꞌl",
  },
  hero: {
    eyebrow: "Acuerdo Gubernativo 59-2012",
    headingLine1: "¿Xk'is ri alicencia rumal jun nima' k'axk'olil?",
    headingLine2: "Mat atojo ri multa: q'exoj ronojel (100%).",
    subtitle:
      "Chachꞌobꞌo pa **man k'o ta 2 minuto** we ri akꞌutunik utz chuwach ri taqanik, jachin casilla kajawatajik chirij ri **Formulario DT-AJ-001**, xuquje' ri wuj kajawatajik kakꞌam pa ventanilla.",
    stat1Value: "Q0.00",
    stat1Caption: "Rajil ri trámite",
    stat2Value: "Kꞌa pa Q300",
    stat2Caption: "Kolotajem chirij ri multa",
    stat3Value: "20 Q'ij",
    stat3Caption: "Q'atbꞌal q'ij re taqanik",
    calloutTitle: "Tz'ib'aj ri Kꞌutunik pa Internet",
    calloutBadge: "Kꞌakꞌ",
    calloutDescription: "Tikaꞌ ri aCUI, atzij, xuquje' chaya' ri oxib' wuj kajawatajik.",
    ctaButton: "Chajkꞌama' ri Trámite",
  },
  causales: {
    eyebrow: "TAQANIK 59-2012",
    heading: "Ri Oxib' Causal kꞌutum rumal Taqanik",
    subheading:
      "We ri akꞌutunik kꞌo pa jun chike we oxib' k'axk'olil, kꞌo aweꞌj chirij taqanik che kakꞌutuj ri q'exonik re 100%.",
    requisitoLabel: "Kꞌo wuj rajawaxik:",
    codigoLabel: "Código GAE:",
    items: [
      {
        casillaLabel: "Casilla 25",
        title: "Yab'il o K'axk'olil",
        description:
          "We xatkꞌojiꞌ pa jun hospital, we xatuxlan rumal yab'il, o mat xatkwin xatpetik che uk'exik ri alicencia.",
        requisito: "Wuj re ajkun rech IGSS, ajkun re amaq', o jun ajkun tz'ib'atalik.",
      },
      {
        casillaLabel: "Casilla 24",
        title: "Jela' Chuwach Iximulew",
        description:
          "We xatkꞌojiꞌ jela' chuwach Iximulew pa ri q'ij are xk'is ri alicencia.",
        requisito: "Wuj re IGM (Movimiento Migratorio) o pasaporte kꞌo retal chwach.",
      },
      {
        casillaLabel: "Casilla 26",
        title: "Tz'apital pa Cárcel",
        description:
          "We xatkꞌojiꞌ tz'apital pa cárcel o katz'apiꞌk rumal jun taqanik are xk'is ri alicencia.",
        requisito: "Wuj re Sistema Penitenciario o re ri Juzgado.",
      },
    ],
  },
  pasos: {
    eyebrow: "B'INEM PA JUB'IQ'",
    heading: "Rox B'inem re Aq'exonik",
    subheading: "Jun trámite k'utum, kachꞌabꞌej awibꞌ, xuquje' man kꞌo ta rajil.",
    items: [
      {
        titulo: "Kꞌama' xuquje' tz'ib'aj ri formulario",
        descripcion:
          "Chatz'ib'aj ri **Formulario DT-AJ-001**. Chakꞌutu' ri casilla kajawatajik (24, 25 o 26) xuquje' chaya' aretal (firma).",
      },
      {
        titulo: "Chamola' ri oxib' awuj",
        descripcion:
          "Xa kajawatajik: **1)** Formulario ukꞌamom retal, **2)** Wachibꞌal re DPI kaꞌib' uxaq, **3)** Wuj kꞌutum ri q'ij (ajkun, IGM, o juzgado).",
      },
      {
        titulo: "Chaya' pa ventanilla",
        descripcion:
          "Chaya' pa Sección de Asuntos Jurídicos re Tránsito PNC. Kaya' na ri acontraseña re unik'oxik. **Kꞌutik pa 20 q'ij re chak.**",
      },
    ],
  },
  sedes: {
    eyebrow: "DEPARTAMENTO DE TRÁNSITO PNC",
    heading: "Chariqa' jun Oficina Naqaj Chawe",
    gpsButtonLoading: "Kariq ri akꞌolibꞌal…",
    gpsButtonUpdate: "Chak'ex ri akꞌolibꞌal",
    gpsButtonUse: "Chakoj ri akꞌolibꞌal",
    statusUnavailable:
      "Man kꞌo ta ri kꞌolibꞌal pa we navegador riꞌ. Katkwin katawil ri oficinas pa mapa.",
    statusDenied:
      "Man xya' ta uwach chi kariq ri akꞌolibꞌal. Chaya' uwach chi kariqitajik naqaj chawe o chawila' ri mapa.",
    statusGenericError: "Man xkwin ta xqariq ri akꞌolibꞌal. Chatriqa' chik o chawila' ri mapa.",
    statusLocating: "Chaya' uwach pa anavegador chi kariq ri akꞌolibꞌal chutzukuxik oficinas naqaj chawe.",
    statusActive: "Katzukuxik oficinas re Departamento de Tránsito PNC naqaj la' akꞌolibꞌal.",
    statusIdle: "Chaya' uwach re akꞌolibꞌal chutzukuxik oficinas naqaj pa Google Maps.",
    mapTitle: "Chatzukuj oficinas re Departamento de Tránsito PNC pa Google Maps",
    footerNote: "Rech ri q'exonik, chachꞌobꞌo che ri Asuntos Jurídicos nabꞌe chi katbꞌe pa jun oficina.",
    infoLinkLabel: "Etamabꞌal Oficial",
    openMapsLinkLabel: "Chajaqa' pa Google Maps",
  },
  faq: {
    heading: "Kꞌutunik kabꞌan amaqꞌel",
    items: [
      {
        question: "¿Kinkwin kintoj nabꞌe ri multa pa MAYCOM kꞌa te ri' kinkꞌutuj utzelik ri rajil?",
        answer:
          "!!Mat.!! Chuwach ri taqanik re Departamento de Tránsito PNC, we xatojik ri multa pa MAYCOM o pa banco, ri tojonik jeqel chik xuquje' man kꞌo ta uchꞌobꞌik chik. Man kꞌo ta jun bꞌinem re utzelik ri rajil. Rumal riꞌ, we ri akꞌutunik kꞌo pa fuerza mayor, rajawaxik kachꞌobꞌ nabꞌe ri q'exonik __nabꞌe cheꞌ__ katatojo na jubꞌiq'.",
      },
      {
        question: "¿Jas kinbꞌan we ri nulicencia man k'a jampa 30 q'ij uk'isik?",
        answer:
          "We ri alicencia man k'a jampa 30 q'ij uk'isik, jat pa jun oficina re MAYCOM chuk'exik pa jun b'inem k'utum. We ri uk'isik xkꞌulmatajik pa jun q'ij re k'axk'olil (yab'il, jela' chuwach amaq', o cárcel), katkwin kakꞌutuj ri q'exonik jampa're kꞌo, xa ta chaya' ri wuj kꞌutum.",
      },
      {
        question: "¿Kakwin jun wachalal kukꞌam ri nuwuj we man kinkwin kinb'e pa tinamit?",
        answer:
          "__Jeꞌ.__ Jun wachalal o jun chik winaq yaꞌom uwach kakwin kukꞌam ri wuj pa Sección de Asuntos Jurídicos re Tránsito PNC. Rajawaxik kukꞌam:\n1) Wuj re yaꞌbꞌal uwach (carta poder) tz'ib'atalik ruk' jun notario.\n2) Wachibꞌal re DPI, are re ajchoqꞌe ri alicencia xuquje' are re ri wachalal.\n3) Ri Formulario DT-AJ-001 ukꞌamom retal, ruk' ri oxib' wuj kꞌutum re ri causal.",
      },
      {
        question: "¿Jampaꞌ q'ij kꞌo ri Sección de Asuntos Jurídicos chubꞌanik ri kꞌutbꞌal?",
        answer:
          "Chuwach ri bꞌinem xuquje' ri Acuerdo Gubernativo 59-2012, ri Sección de Asuntos Jurídicos kꞌo ##20 q'ij re chak## chuya'ik ri kꞌutbꞌal, kajun cheꞌ xjachik ronojel ri wuj ruk' ri contraseña.",
      },
      {
        question: "¿Kꞌo rajil we trámite re q'exonik riꞌ?",
        answer:
          "__Man kꞌo ta chi jubꞌiq'.__ Ri kꞌutunik re q'exonik multa rumal fuerza mayor chuwach ri Departamento de Tránsito re Ajchakib' Utzilal Amaq' are ++100% man kꞌo ta rajil++. Majun ajchak o winaq yaꞌom uwach kutoj rajil rumal we trámite riꞌ.",
      },
    ],
  },
  footer: {
    institution: "Departamento de Tránsito re Ajchakib' Utzilal Amaq'",
    legal: "Amaq' Iximulew · Taqanik: Acuerdo Gubernativo 59-2012",
    badge: "Trámite Oficial Man Kꞌo Ta Rajil",
  },
  kicheDisclaimer:
    "Uxlanem: We tzij k'iche' waral jun nab'e etamanik b'anom rukꞌ IA (traducción), man kꞌutum ta na rumal jun ajk'iche' tzijonel. We kꞌo sach'ik, chatzukuj ri tzij pa español.",
};
