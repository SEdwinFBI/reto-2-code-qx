import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CAUSALES, type CausalKey } from "@/lib/causales";

export const runtime = "nodejs";

const PLAZO_DIAS_HABILES = 20;

type RouteParams = { params: Promise<{ token: string }> };

// Consulta pública del estado de una solicitud mediante token.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { token } = await params;

  const solicitud = await prisma.solicitud.findUnique({
    where: { trackerToken: token },
    select: {
      numeroExpediente: true,
      causal: true,
      estado: true,
      motivoRechazo: true,
      createdAt: true,
    },
  });

  if (!solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  return NextResponse.json({
    numeroExpediente: solicitud.numeroExpediente,
    causal: solicitud.causal,
    causalNombre: CAUSALES[solicitud.causal as CausalKey].titulo,
    estado: solicitud.estado,
    motivoRechazo: solicitud.motivoRechazo,
    fechaRadicacion: solicitud.createdAt.toISOString(),
    plazoDiasHabiles: PLAZO_DIAS_HABILES,
  });
}
