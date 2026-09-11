import nodemailer from "nodemailer";

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

export async function sendConfirmacionRecepcionEmail(params: {
  to: string;
  numeroExpediente: string;
  trackerToken: string;
  plazoDiasHabiles: number;
}) {
  const trackerUrl = buildTrackerUrl(params.trackerToken);
  await safeSendMail({
    to: params.to,
    subject: `Solicitud recibida: ${params.numeroExpediente}`,
    html: `
      <p>Hemos recibido su solicitud de exoneración de multa <b>${params.numeroExpediente}</b>.</p>
      <p>Plazo estimado de resolución: ${params.plazoDiasHabiles} días hábiles.</p>
      <p>Puede consultar el estado de su trámite en cualquier momento aquí: <a href="${trackerUrl}">${trackerUrl}</a></p>
    `,
  });
}

export async function sendEnRevisionEmail(params: {
  to: string;
  numeroExpediente: string;
  trackerToken: string;
}) {
  const trackerUrl = buildTrackerUrl(params.trackerToken);
  await safeSendMail({
    to: params.to,
    subject: `Su solicitud ${params.numeroExpediente} está en revisión`,
    html: `
      <p>Su solicitud <b>${params.numeroExpediente}</b> ha pasado a estado <b>en revisión</b>.</p>
      <p>Puede consultar el estado de su trámite aquí: <a href="${trackerUrl}">${trackerUrl}</a></p>
    `,
  });
}

export async function sendResolucionEmail(params: {
  to: string;
  numeroExpediente: string;
  trackerToken: string;
  aprobado: boolean;
  motivoRechazo?: string;
}) {
  const trackerUrl = buildTrackerUrl(params.trackerToken);
  const subject = params.aprobado
    ? `Resolución de su solicitud ${params.numeroExpediente}: APROBADA`
    : `Resolución de su solicitud ${params.numeroExpediente}: RECHAZADA`;
  const html = params.aprobado
    ? `
      <p>Su solicitud <b>${params.numeroExpediente}</b> ha sido <b>aprobada</b>.</p>
      <p>Detalle: <a href="${trackerUrl}">${trackerUrl}</a></p>
    `
    : `
      <p>Su solicitud <b>${params.numeroExpediente}</b> ha sido <b>rechazada</b>.</p>
      <p>Motivo: ${params.motivoRechazo ?? "No especificado"}</p>
      <p>Detalle: <a href="${trackerUrl}">${trackerUrl}</a></p>
    `;
  await safeSendMail({ to: params.to, subject, html });
}
