import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CAUSALES, isCausalKey, type CausalKey } from "@/lib/causales";
import {
  solicitudFormSchema,
  validateFile,
} from "@/lib/validation/solicitud";
import {
  buildSolicitudFilePath,
  uploadSolicitudFile,
} from "@/lib/firebase-storage";
import { sendConfirmacionRecepcionEmail } from "@/lib/mailer";
import { generateNumeroExpediente } from "@/lib/numero-expediente";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

export const runtime = "nodejs";

const PLAZO_DIAS_HABILES = 20;

function coerceBoolean(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getOptionalStringField(formData: FormData, key: string): string | undefined {
  const value = getStringField(formData, key);
  return value.length > 0 ? value : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const rawInput = {
      cui: getStringField(formData, "cui"),
      nombres: getStringField(formData, "nombres"),
      apellidos: getStringField(formData, "apellidos"),
      telefono: getStringField(formData, "telefono"),
      correo: getStringField(formData, "correo"),
      causal: getStringField(formData, "causal"),
      fechaVencimiento: getStringField(formData, "fechaVencimiento"),
      fechaHecho: getStringField(formData, "fechaHecho"),
      observaciones: getOptionalStringField(formData, "observaciones"),

      esGestionadoPorTercero: coerceBoolean(formData.get("esGestionadoPorTercero")),
      gestorNombreCompleto: getOptionalStringField(formData, "gestorNombreCompleto"),
      gestorCui: getOptionalStringField(formData, "gestorCui"),
      gestorRelacion: getOptionalStringField(formData, "gestorRelacion"),
      gestorTelefono: getOptionalStringField(formData, "gestorTelefono"),
      gestorCorreo: getOptionalStringField(formData, "gestorCorreo"),

      esEmpleadoGobierno: coerceBoolean(formData.get("esEmpleadoGobierno")),
      empleadoPuesto: getOptionalStringField(formData, "empleadoPuesto"),
      empleadoInstitucion: getOptionalStringField(formData, "empleadoInstitucion"),
    };

    const parsed = solicitudFormSchema.safeParse(rawInput);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos de la solicitud inválidos.",
          details: parsed.error.issues.map((i) => i.message).join(" | "),
        },
        { status: 400 }
      );
    }

    if (!isCausalKey(parsed.data.causal)) {
      return NextResponse.json(
        { error: "Causal inválida." },
        { status: 400 }
      );
    }
    const causal = parsed.data.causal as CausalKey;

    const dpiFile = formData.get("archivoDpi");
    const comprobanteFile = formData.get("archivoComprobante");
    const autorizacionFile = formData.get("archivoAutorizacion");

    const dpi = dpiFile instanceof File ? dpiFile : null;
    const comprobante = comprobanteFile instanceof File ? comprobanteFile : null;
    const autorizacion = autorizacionFile instanceof File ? autorizacionFile : null;

    const fileErrors = [
      validateFile(dpi, { required: true, label: "El DPI" }),
      validateFile(comprobante, {
        required: true,
        label: `El comprobante (${CAUSALES[causal].requisitoComprobante})`,
      }),
      validateFile(autorizacion, {
        required: parsed.data.esGestionadoPorTercero,
        label: "El documento de autorización/carta poder",
      }),
    ].filter((e): e is string => Boolean(e));

    if (fileErrors.length > 0) {
      return NextResponse.json(
        { error: "Archivos inválidos.", details: fileErrors.join(" | ") },
        { status: 400 }
      );
    }

    const numeroExpediente = await generateNumeroExpediente();

    const dpiUpload = await uploadSolicitudFile({
      buffer: Buffer.from(await dpi!.arrayBuffer()),
      destinationPath: buildSolicitudFilePath(numeroExpediente, "dpi", dpi!.type),
      contentType: dpi!.type,
    });

    const comprobanteUpload = await uploadSolicitudFile({
      buffer: Buffer.from(await comprobante!.arrayBuffer()),
      destinationPath: buildSolicitudFilePath(
        numeroExpediente,
        "comprobante",
        comprobante!.type
      ),
      contentType: comprobante!.type,
    });

    let autorizacionUpload: { storagePath: string } | null = null;
    if (autorizacion) {
      autorizacionUpload = await uploadSolicitudFile({
        buffer: Buffer.from(await autorizacion.arrayBuffer()),
        destinationPath: buildSolicitudFilePath(
          numeroExpediente,
          "autorizacion",
          autorizacion.type
        ),
        contentType: autorizacion.type,
      });
    }

    const solicitud = await prisma.solicitud.create({
      data: {
        numeroExpediente,
        cui: parsed.data.cui,
        nombres: parsed.data.nombres,
        apellidos: parsed.data.apellidos,
        telefono: parsed.data.telefono,
        correo: parsed.data.correo,
        causal,
        fechaVencimiento: new Date(parsed.data.fechaVencimiento),
        fechaHecho: new Date(parsed.data.fechaHecho),
        observaciones: parsed.data.observaciones,

        esGestionadoPorTercero: parsed.data.esGestionadoPorTercero,
        gestorNombreCompleto: parsed.data.gestorNombreCompleto,
        gestorCui: parsed.data.gestorCui,
        gestorRelacion: parsed.data.gestorRelacion,
        gestorTelefono: parsed.data.gestorTelefono,
        gestorCorreo: parsed.data.gestorCorreo,

        esEmpleadoGobierno: parsed.data.esEmpleadoGobierno,
        empleadoPuesto: parsed.data.empleadoPuesto,
        empleadoInstitucion: parsed.data.empleadoInstitucion,

        dpiStoragePath: dpiUpload.storagePath,
        dpiOriginalName: dpi!.name,
        dpiContentType: dpi!.type,
        dpiSizeBytes: dpi!.size,

        comprobanteStoragePath: comprobanteUpload.storagePath,
        comprobanteOriginalName: comprobante!.name,
        comprobanteContentType: comprobante!.type,
        comprobanteSizeBytes: comprobante!.size,

        ...(autorizacionUpload && autorizacion
          ? {
              autorizacionStoragePath: autorizacionUpload.storagePath,
              autorizacionOriginalName: autorizacion.name,
              autorizacionContentType: autorizacion.type,
              autorizacionSizeBytes: autorizacion.size,
              autorizacionUploadedAt: new Date(),
            }
          : {}),

        historial: {
          create: {
            estadoAnterior: null,
            estadoNuevo: "PENDIENTE",
            actor: "sistema",
          },
        },
      },
    });

    const destinatario = parsed.data.esGestionadoPorTercero
      ? parsed.data.gestorCorreo!
      : parsed.data.correo;

    await sendConfirmacionRecepcionEmail({
      to: destinatario,
      numeroExpediente: solicitud.numeroExpediente,
      trackerToken: solicitud.trackerToken,
      plazoDiasHabiles: PLAZO_DIAS_HABILES,
    });

    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    const urlSeguimiento = `${base.replace(/\/$/, "")}/seguimiento/${solicitud.trackerToken}`;

    return NextResponse.json(
      {
        numeroExpediente: solicitud.numeroExpediente,
        fechaRadicacion: solicitud.createdAt.toISOString(),
        plazoDiasHabiles: PLAZO_DIAS_HABILES,
        causalNombre: CAUSALES[causal].titulo,
        urlSeguimiento,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creando solicitud:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json(
      { error: "Error procesando la solicitud.", details: errorMessage },
      { status: 500 }
    );
  }
}

const ESTADOS_VALIDOS = ["PENDIENTE", "EN_REVISION", "APROBADA", "RECHAZADA"] as const;
type EstadoValido = (typeof ESTADOS_VALIDOS)[number];

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function parsePositiveInt(value: string | null, fallback: number, max?: number): number {
  const parsed = value ? Number.parseInt(value, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return max ? Math.min(parsed, max) : parsed;
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(cookie))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;

  const estadoParam = params.get("estado");
  const estado =
    estadoParam && (ESTADOS_VALIDOS as readonly string[]).includes(estadoParam)
      ? (estadoParam as EstadoValido)
      : undefined;

  const q = params.get("q")?.trim();
  const page = parsePositiveInt(params.get("page"), 1);
  const pageSize = parsePositiveInt(params.get("pageSize"), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  const where = {
    ...(estado ? { estado } : {}),
    ...(q
      ? {
          OR: [
            { numeroExpediente: { contains: q, mode: "insensitive" as const } },
            { cui: { contains: q, mode: "insensitive" as const } },
            { nombres: { contains: q, mode: "insensitive" as const } },
            { apellidos: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [solicitudes, total, countsRaw] = await Promise.all([
    prisma.solicitud.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        numeroExpediente: true,
        nombres: true,
        apellidos: true,
        causal: true,
        estado: true,
        esGestionadoPorTercero: true,
        gestorNombreCompleto: true,
        gestorRelacion: true,
        esEmpleadoGobierno: true,
        createdAt: true,
      },
    }),
    prisma.solicitud.count({ where }),
    prisma.solicitud.groupBy({ by: ["estado"], _count: { _all: true } }),
  ]);

  const countsByEstado = countsRaw.reduce<Record<string, number>>((acc, row) => {
    acc[row.estado] = row._count._all;
    return acc;
  }, {});

  return NextResponse.json({ solicitudes, total, page, pageSize, countsByEstado });
}
