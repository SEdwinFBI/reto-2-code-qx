import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/firebase-storage";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ token: string }> };

// Descarga pública del documento de resolución si la solicitud está aprobada.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { token } = await params;

  const solicitud = await prisma.solicitud.findUnique({
    where: { trackerToken: token },
    select: {
      estado: true,
      resolucionStoragePath: true,
      resolucionOriginalName: true,
    },
  });

  if (!solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  if (solicitud.estado !== "APROBADA") {
    return NextResponse.json(
      { error: "El documento solo está disponible cuando la solicitud está aprobada." },
      { status: 403 }
    );
  }

  if (!solicitud.resolucionStoragePath) {
    return NextResponse.json(
      { error: "Aún no se ha cargado el documento de resolución." },
      { status: 404 }
    );
  }

  const url = await getSignedUrl(solicitud.resolucionStoragePath);

  return NextResponse.json({
    url,
    nombreArchivo: solicitud.resolucionOriginalName,
  });
}
