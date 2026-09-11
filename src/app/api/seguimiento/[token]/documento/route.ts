import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/firebase-storage";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ token: string }> };

/**
 * Endpoint público (sin autenticación) para que el ciudadano descargue el
 * documento de resolución/exoneración de su solicitud, usando el token
 * opaco de seguimiento. Solo responde con una URL cuando la solicitud está
 * APROBADA y tiene un archivo de resolución cargado por el admin; en
 * cualquier otro caso no revela nada del estado ni de los archivos.
 */
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
