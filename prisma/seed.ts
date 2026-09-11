/**
 * Script de datos de prueba: inserta Solicitud de ejemplo directo en la BD
 * vía Prisma, sin pasar por el endpoint real (no sube archivos a Firebase
 * ni envía correos). Usa rutas de archivo dummy solo para satisfacer el
 * schema (campos no-nulos).
 *
 * Uso: npx tsx prisma/seed.ts   (o vía el script "seed" de package.json)
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateNumeroExpediente } from "../src/lib/numero-expediente";
import type { CausalTramite, EstadoSolicitud } from "../generated/prisma/client";

type SeedSolicitud = {
  cui: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  causal: CausalTramite;
  fechaVencimiento: Date;
  fechaHecho: Date;
  estado: EstadoSolicitud;
  esGestionadoPorTercero?: boolean;
  gestorNombreCompleto?: string;
  gestorCui?: string;
  gestorRelacion?: string;
  gestorTelefono?: string;
  gestorCorreo?: string;
};

const DUMMY_FILE = {
  storagePath: "seed/dummy.pdf",
  originalName: "dummy.pdf",
  contentType: "application/pdf",
  sizeBytes: 1024,
};

const SEED_SOLICITUDES: SeedSolicitud[] = [
  {
    cui: "1234567890101",
    nombres: "María José",
    apellidos: "López García",
    telefono: "55512345",
    correo: "maria.lopez@example.com",
    causal: "FUERA_DEL_PAIS",
    fechaVencimiento: new Date("2025-01-15"),
    fechaHecho: new Date("2025-02-01"),
    estado: "PENDIENTE",
  },
  {
    cui: "2345678901012",
    nombres: "Carlos Enrique",
    apellidos: "Pérez Ramírez",
    telefono: "55523456",
    correo: "carlos.perez@example.com",
    causal: "ENFERMEDAD_ACCIDENTE",
    fechaVencimiento: new Date("2025-03-10"),
    fechaHecho: new Date("2025-03-12"),
    estado: "EN_REVISION",
  },
  {
    cui: "3456789010123",
    nombres: "Ana Lucía",
    apellidos: "Martínez Soto",
    telefono: "55534567",
    correo: "ana.martinez@example.com",
    causal: "PRIVADO_LIBERTAD",
    fechaVencimiento: new Date("2024-11-20"),
    fechaHecho: new Date("2024-12-05"),
    estado: "APROBADA",
  },
  {
    cui: "4567890101234",
    nombres: "Jorge Luis",
    apellidos: "Hernández Cruz",
    telefono: "55545678",
    correo: "jorge.hernandez@example.com",
    causal: "FUERA_DEL_PAIS",
    fechaVencimiento: new Date("2025-04-01"),
    fechaHecho: new Date("2025-04-20"),
    estado: "RECHAZADA",
  },
  {
    cui: "5678901012345",
    nombres: "Patricia Elena",
    apellidos: "Gómez Aguilar",
    telefono: "55556789",
    correo: "gestor.patricia@example.com",
    causal: "ENFERMEDAD_ACCIDENTE",
    fechaVencimiento: new Date("2025-05-05"),
    fechaHecho: new Date("2025-05-10"),
    estado: "PENDIENTE",
    esGestionadoPorTercero: true,
    gestorNombreCompleto: "Luis Fernando Gómez",
    gestorCui: "6789010123456",
    gestorRelacion: "hijo",
    gestorTelefono: "55567890",
    gestorCorreo: "luis.gomez@example.com",
  },
];

async function main() {
  for (const s of SEED_SOLICITUDES) {
    const numeroExpediente = await generateNumeroExpediente();

    const solicitud = await prisma.solicitud.create({
      data: {
        numeroExpediente,
        cui: s.cui,
        nombres: s.nombres,
        apellidos: s.apellidos,
        telefono: s.telefono,
        correo: s.correo,
        causal: s.causal,
        fechaVencimiento: s.fechaVencimiento,
        fechaHecho: s.fechaHecho,
        estado: s.estado,

        esGestionadoPorTercero: s.esGestionadoPorTercero ?? false,
        gestorNombreCompleto: s.gestorNombreCompleto,
        gestorCui: s.gestorCui,
        gestorRelacion: s.gestorRelacion,
        gestorTelefono: s.gestorTelefono,
        gestorCorreo: s.gestorCorreo,

        dpiStoragePath: DUMMY_FILE.storagePath,
        dpiOriginalName: DUMMY_FILE.originalName,
        dpiContentType: DUMMY_FILE.contentType,
        dpiSizeBytes: DUMMY_FILE.sizeBytes,

        comprobanteStoragePath: DUMMY_FILE.storagePath,
        comprobanteOriginalName: DUMMY_FILE.originalName,
        comprobanteContentType: DUMMY_FILE.contentType,
        comprobanteSizeBytes: DUMMY_FILE.sizeBytes,

        historial: {
          create: {
            estadoAnterior: null,
            estadoNuevo: s.estado,
            actor: "seed",
            nota: "Registro de prueba creado por prisma/seed.ts",
          },
        },
      },
    });

    console.log(`✔ Creada solicitud ${solicitud.numeroExpediente} (${solicitud.estado})`);
  }
}

main()
  .catch((err) => {
    console.error("Error en seed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
