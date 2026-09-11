import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/firebase-storage";
import { sendEnRevisionEmail, sendResolucionEmail } from "@/lib/mailer";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import type { PrismaTransactionClient } from "@/lib/prisma";
import type { EstadoSolicitud } from "../../../../../generated/prisma/enums";

export const runtime = "nodejs";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(cookie);
}

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const solicitud = await prisma.solicitud.findUnique({
    where: { id },
    include: { historial: { orderBy: { createdAt: "asc" } } },
  });

  if (!solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  const [dpiUrl, comprobanteUrl, autorizacionUrl] = await Promise.all([
    getSignedUrl(solicitud.dpiStoragePath),
    getSignedUrl(solicitud.comprobanteStoragePath),
    solicitud.autorizacionStoragePath
      ? getSignedUrl(solicitud.autorizacionStoragePath)
      : Promise.resolve(null),
  ]);

  return NextResponse.json({
    ...solicitud,
    dpiUrl,
    comprobanteUrl,
    autorizacionUrl,
  });
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
  const body = await request.json().catch(() => null);
  const accion = body?.accion as string | undefined;
  const motivoRechazo = body?.motivoRechazo as string | undefined;
  const nota = body?.nota as string | undefined;

  if (!accion || !(accion in TRANSITIONS)) {
    return NextResponse.json(
      { error: "Acción inválida. Use iniciar_revision, aprobar o rechazar." },
      { status: 400 }
    );
  }

  if (accion === "rechazar" && !motivoRechazo) {
    return NextResponse.json(
      { error: "motivoRechazo es obligatorio al rechazar." },
      { status: 400 }
    );
  }

  const solicitud = await prisma.solicitud.findUnique({ where: { id } });
  if (!solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  const nuevoEstado = TRANSITIONS[accion];
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

  const updated = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const result = await tx.solicitud.update({
      where: { id },
      data: {
        estado: nuevoEstado,
        ...(accion === "iniciar_revision" ? { revisadoPor: actor } : {}),
        ...(accion === "rechazar" ? { motivoRechazo } : {}),
        ...(nota ? { notaRevisor: nota } : {}),
        ...(accion === "aprobar" || accion === "rechazar"
          ? { resueltoPor: actor, resueltoEn: now }
          : {}),
      },
    });

    await tx.estadoHistorial.create({
      data: {
        solicitudId: id,
        estadoAnterior: solicitud.estado,
        estadoNuevo: nuevoEstado,
        actor,
        nota,
      },
    });

    return result;
  });

  const destinatario = updated.esGestionadoPorTercero
    ? updated.gestorCorreo!
    : updated.correo;

  if (accion === "iniciar_revision") {
    await sendEnRevisionEmail({
      to: destinatario,
      numeroExpediente: updated.numeroExpediente,
      trackerToken: updated.trackerToken,
    });
  } else {
    await sendResolucionEmail({
      to: destinatario,
      numeroExpediente: updated.numeroExpediente,
      trackerToken: updated.trackerToken,
      aprobado: accion === "aprobar",
      motivoRechazo: updated.motivoRechazo ?? undefined,
    });
  }

  return NextResponse.json(updated);
}
