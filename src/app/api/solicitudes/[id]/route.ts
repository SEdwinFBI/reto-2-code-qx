import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildSolicitudFilePath,
  getSignedUrl,
  uploadSolicitudFile,
} from "@/lib/firebase-storage";
import { validateFile } from "@/lib/validation/solicitud";
import { sendEnRevisionEmail, sendResolucionEmail } from "@/lib/mailer";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import type { CausalKey } from "@/lib/causales";
import type { PrismaTransactionClient } from "@/lib/prisma";
import type { EstadoSolicitud } from "../../../../../generated/prisma/enums";

export const runtime = "nodejs";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(cookie);
}

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Carga la solicitud con su historial y arma el mismo shape de `SolicitudDetail`
 * (URLs firmadas incluidas) que consume el frontend, para usarse tanto en GET
 * como tras un PATCH exitoso.
 */
async function loadSolicitudDetail(id: string) {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id },
    include: { historial: { orderBy: { createdAt: "asc" } } },
  });

  if (!solicitud) return null;

  const [dpiUrl, comprobanteUrl, autorizacionUrl, resolucionUrl] = await Promise.all([
    getSignedUrl(solicitud.dpiStoragePath),
    getSignedUrl(solicitud.comprobanteStoragePath),
    solicitud.autorizacionStoragePath
      ? getSignedUrl(solicitud.autorizacionStoragePath)
      : Promise.resolve(null),
    solicitud.resolucionStoragePath
      ? getSignedUrl(solicitud.resolucionStoragePath)
      : Promise.resolve(null),
  ]);

  return {
    ...solicitud,
    dpiUrl,
    comprobanteUrl,
    autorizacionUrl,
    resolucionUrl,
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const detail = await loadSolicitudDetail(id);

  if (!detail) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  return NextResponse.json(detail);
}

const TRANSITIONS: Record<string, EstadoSolicitud> = {
  iniciar_revision: "EN_REVISION",
  aprobar: "APROBADA",
  rechazar: "RECHAZADA",
};

const ALLOWED_FROM: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  PENDIENTE: ["EN_REVISION", "APROBADA", "RECHAZADA"],
  EN_REVISION: ["APROBADA", "RECHAZADA"],
  APROBADA: [],
  RECHAZADA: [],
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const formData = await request.formData();
  const accion = formData.get("accion");
  const motivoRechazo = formData.get("motivoRechazo");
  const nota = formData.get("nota");
  const archivoResolucionField = formData.get("archivoResolucion");

  const accionStr = typeof accion === "string" ? accion : undefined;
  const motivoRechazoStr = typeof motivoRechazo === "string" ? motivoRechazo : undefined;
  const notaStr = typeof nota === "string" ? nota : undefined;
  const archivoResolucion =
    archivoResolucionField instanceof File ? archivoResolucionField : null;

  if (!accionStr || !(accionStr in TRANSITIONS)) {
    return NextResponse.json(
      { error: "Acción inválida. Use iniciar_revision, aprobar o rechazar." },
      { status: 400 }
    );
  }

  if (accionStr === "rechazar" && !motivoRechazoStr) {
    return NextResponse.json(
      { error: "motivoRechazo es obligatorio al rechazar." },
      { status: 400 }
    );
  }

  if (accionStr === "aprobar") {
    const fileError = validateFile(archivoResolucion, {
      required: true,
      label: "El documento de resolución/exoneración",
    });
    if (fileError) {
      return NextResponse.json(
        { error: "Archivo inválido.", details: fileError },
        { status: 400 }
      );
    }
  }

  const solicitud = await prisma.solicitud.findUnique({ where: { id } });
  if (!solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  const nuevoEstado = TRANSITIONS[accionStr];
  if (!ALLOWED_FROM[solicitud.estado].includes(nuevoEstado)) {
    return NextResponse.json(
      {
        error: `Transición inválida: no se puede pasar de ${solicitud.estado} a ${nuevoEstado}.`,
      },
      { status: 409 }
    );
  }

  const actor = "admin";
  const now = new Date();

  let resolucionUpload: { storagePath: string } | null = null;
  if (accionStr === "aprobar" && archivoResolucion) {
    resolucionUpload = await uploadSolicitudFile({
      buffer: Buffer.from(await archivoResolucion.arrayBuffer()),
      destinationPath: buildSolicitudFilePath(
        solicitud.numeroExpediente,
        "resolucion",
        archivoResolucion.type
      ),
      contentType: archivoResolucion.type,
    });
  }

  const updated = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const result = await tx.solicitud.update({
      where: { id },
      data: {
        estado: nuevoEstado,
        ...(accionStr === "iniciar_revision" ? { revisadoPor: actor } : {}),
        ...(accionStr === "rechazar" ? { motivoRechazo: motivoRechazoStr } : {}),
        ...(notaStr ? { notaRevisor: notaStr } : {}),
        ...(accionStr === "aprobar" || accionStr === "rechazar"
          ? { resueltoPor: actor, resueltoEn: now }
          : {}),
        ...(resolucionUpload && archivoResolucion
          ? {
              resolucionStoragePath: resolucionUpload.storagePath,
              resolucionOriginalName: archivoResolucion.name,
              resolucionContentType: archivoResolucion.type,
              resolucionSizeBytes: archivoResolucion.size,
              resolucionUploadedAt: now,
            }
          : {}),
      },
    });

    await tx.estadoHistorial.create({
      data: {
        solicitudId: id,
        estadoAnterior: solicitud.estado,
        estadoNuevo: nuevoEstado,
        actor,
        nota: notaStr,
      },
    });

    return result;
  });

  const destinatario = updated.esGestionadoPorTercero
    ? updated.gestorCorreo!
    : updated.correo;

  if (accionStr === "iniciar_revision") {
    await sendEnRevisionEmail({
      to: destinatario,
      numeroExpediente: updated.numeroExpediente,
      trackerToken: updated.trackerToken,
      causal: updated.causal as CausalKey,
    });
  } else {
    await sendResolucionEmail({
      to: destinatario,
      numeroExpediente: updated.numeroExpediente,
      trackerToken: updated.trackerToken,
      aprobado: accionStr === "aprobar",
      motivoRechazo: updated.motivoRechazo ?? undefined,
      causal: updated.causal as CausalKey,
    });
  }

  const detail = await loadSolicitudDetail(id);
  return NextResponse.json(detail);
}
