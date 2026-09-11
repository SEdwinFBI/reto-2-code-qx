import nodemailer from "nodemailer";
import { CAUSALES, type CausalKey } from "@/lib/causales";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

function buildTrackerUrl(trackerToken: string): string {
  const base = process.env.APP_BASE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/seguimiento/${trackerToken}`;
}

async function safeSendMail(options: Parameters<ReturnType<typeof nodemailer.createTransport>["sendMail"]>[0]) {
  try {
    await getTransporter().sendMail({ from: process.env.SMTP_FROM, ...options });
  } catch (error) {
    // Un fallo de correo nunca debe tumbar el flujo de la solicitud.
    console.error("Error enviando correo:", error);
  }
}

const BRAND_NAME = "Tránsito PNC Guatemala";
const BRAND_COLOR = "#1e3a5f";
const ACCENT_COLOR = "#c62828";

// Genera la plantilla HTML base con estilos inline para correos.
function renderEmailLayout(params: {
  title: string;
  preheader: string;
  bodyHtml: string;
  ctaHref?: string;
  ctaLabel?: string;
}): string {
  const { title, preheader, bodyHtml, ctaHref, ctaLabel } = params;

  const ctaHtml = ctaHref
    ? `
      <tr>
        <td align="center" style="padding: 8px 32px 32px 32px;">
          <a href="${ctaHref}"
             style="display:inline-block; background-color:${BRAND_COLOR}; color:#ffffff; text-decoration:none;
                    font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold;
                    padding:14px 28px; border-radius:6px;">
            ${ctaLabel ?? "Ver estado de mi trámite"}
          </a>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0 32px 32px 32px; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#666666;">
          Si el botón no funciona, copie y pegue este enlace en su navegador:<br />
          <a href="${ctaHref}" style="color:${BRAND_COLOR}; word-break:break-all;">${ctaHref}</a>
        </td>
      </tr>
    `
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f2f2f2;">
    <!-- Texto de vista previa, oculto -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f2f2; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                 style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px; width:100%;">
            <tr>
              <td style="background-color:${BRAND_COLOR}; padding:24px 32px;">
                <span style="font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; color:#ffffff;">
                  ${BRAND_NAME}
                </span>
                <br />
                <span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#cbd7e6;">
                  Exoneración de multas por vencimiento de licencia
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#222222;">
                ${bodyHtml}
              </td>
            </tr>
            ${ctaHtml}
            <tr>
              <td style="background-color:#f8f8f8; padding:20px 32px; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#888888; border-top:1px solid #e5e5e5;">
                Este es un correo generado automáticamente, por favor no responda a esta dirección.
                Si tiene dudas sobre su trámite, consulte el estado en el enlace de seguimiento incluido
                en este mensaje.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}

function causalTitulo(causal?: CausalKey): string | undefined {
  return causal ? CAUSALES[causal].titulo : undefined;
}

export async function sendConfirmacionRecepcionEmail(params: {
  to: string;
  numeroExpediente: string;
  trackerToken: string;
  plazoDiasHabiles: number;
  causal?: CausalKey;
}) {
  const trackerUrl = buildTrackerUrl(params.trackerToken);
  const titulo = causalTitulo(params.causal);

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">Hemos recibido su solicitud de exoneración de multa.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f5f7fa; border-radius:6px; margin-bottom:16px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:0 0 8px 0;"><b>No. de expediente:</b> ${params.numeroExpediente}</p>
          ${titulo ? `<p style="margin:0 0 8px 0;"><b>Causal:</b> ${titulo}</p>` : ""}
          <p style="margin:0;"><b>Plazo estimado de resolución:</b> ${params.plazoDiasHabiles} días hábiles</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;">Puede consultar el estado de su trámite en cualquier momento usando el botón
    de abajo o el número de expediente.</p>
  `;

  await safeSendMail({
    to: params.to,
    subject: `Solicitud recibida: ${params.numeroExpediente}`,
    html: renderEmailLayout({
      title: `Solicitud recibida: ${params.numeroExpediente}`,
      preheader: `Su solicitud ${params.numeroExpediente} fue recibida y está pendiente de revisión.`,
      bodyHtml,
      ctaHref: trackerUrl,
      ctaLabel: "Ver estado de mi trámite",
    }),
  });
}

export async function sendEnRevisionEmail(params: {
  to: string;
  numeroExpediente: string;
  trackerToken: string;
  causal?: CausalKey;
}) {
  const trackerUrl = buildTrackerUrl(params.trackerToken);
  const titulo = causalTitulo(params.causal);

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">
      Su solicitud <b>${params.numeroExpediente}</b>${titulo ? ` (${titulo})` : ""}
      ha pasado a estado <b>En revisión</b>.
    </p>
    <p style="margin:0;">
      Un analista está revisando la documentación presentada. Le notificaremos por este medio en cuanto
      exista una resolución.
    </p>
  `;

  await safeSendMail({
    to: params.to,
    subject: `Su solicitud ${params.numeroExpediente} está en revisión`,
    html: renderEmailLayout({
      title: `Solicitud en revisión: ${params.numeroExpediente}`,
      preheader: `Su solicitud ${params.numeroExpediente} está siendo revisada.`,
      bodyHtml,
      ctaHref: trackerUrl,
      ctaLabel: "Ver estado de mi trámite",
    }),
  });
}

export async function sendResolucionEmail(params: {
  to: string;
  numeroExpediente: string;
  trackerToken: string;
  aprobado: boolean;
  motivoRechazo?: string;
  causal?: CausalKey;
}) {
  const trackerUrl = buildTrackerUrl(params.trackerToken);
  const titulo = causalTitulo(params.causal);

  const subject = params.aprobado
    ? `Resolución de su solicitud ${params.numeroExpediente}: APROBADA`
    : `Resolución de su solicitud ${params.numeroExpediente}: RECHAZADA`;

  const bodyHtml = params.aprobado
    ? `
      <p style="margin:0 0 16px 0;">
        Su solicitud <b>${params.numeroExpediente}</b>${titulo ? ` (${titulo})` : ""} ha sido
        <b style="color:#1a7a1a;">APROBADA</b>.
      </p>
      <p style="margin:0 0 16px 0;">
        Puede descargar el documento de resolución/exoneración desde la página de seguimiento de su
        trámite, usando el botón de abajo.
      </p>
    `
    : `
      <p style="margin:0 0 16px 0;">
        Su solicitud <b>${params.numeroExpediente}</b>${titulo ? ` (${titulo})` : ""} ha sido
        <b style="color:${ACCENT_COLOR};">RECHAZADA</b>.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="background-color:#fdf2f2; border-left:4px solid ${ACCENT_COLOR}; border-radius:4px; margin-bottom:16px;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0;"><b>Motivo:</b> ${params.motivoRechazo ?? "No especificado"}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0;">Puede revisar el detalle completo de su trámite en la página de seguimiento.</p>
    `;

  await safeSendMail({
    to: params.to,
    subject,
    html: renderEmailLayout({
      title: subject,
      preheader: params.aprobado
        ? `Su solicitud ${params.numeroExpediente} fue aprobada.`
        : `Su solicitud ${params.numeroExpediente} fue rechazada.`,
      bodyHtml,
      ctaHref: trackerUrl,
      ctaLabel: params.aprobado ? "Descargar resolución" : "Ver detalle de mi trámite",
    }),
  });
}
