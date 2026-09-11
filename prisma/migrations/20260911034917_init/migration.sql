-- CreateEnum
CREATE TYPE "CausalTramite" AS ENUM ('FUERA_DEL_PAIS', 'ENFERMEDAD_ACCIDENTE', 'PRIVADO_LIBERTAD');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "numeroExpediente" TEXT NOT NULL,
    "trackerToken" TEXT NOT NULL,
    "cui" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "causal" "CausalTramite" NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fechaHecho" TIMESTAMP(3) NOT NULL,
    "observaciones" TEXT,
    "esGestionadoPorTercero" BOOLEAN NOT NULL DEFAULT false,
    "gestorNombreCompleto" TEXT,
    "gestorCui" TEXT,
    "gestorRelacion" TEXT,
    "gestorTelefono" TEXT,
    "gestorCorreo" TEXT,
    "esEmpleadoGobierno" BOOLEAN NOT NULL DEFAULT false,
    "empleadoPuesto" TEXT,
    "empleadoInstitucion" TEXT,
    "dpiStoragePath" TEXT NOT NULL,
    "dpiOriginalName" TEXT NOT NULL,
    "dpiContentType" TEXT NOT NULL,
    "dpiSizeBytes" INTEGER NOT NULL,
    "dpiUploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comprobanteStoragePath" TEXT NOT NULL,
    "comprobanteOriginalName" TEXT NOT NULL,
    "comprobanteContentType" TEXT NOT NULL,
    "comprobanteSizeBytes" INTEGER NOT NULL,
    "comprobanteUploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autorizacionStoragePath" TEXT,
    "autorizacionOriginalName" TEXT,
    "autorizacionContentType" TEXT,
    "autorizacionSizeBytes" INTEGER,
    "autorizacionUploadedAt" TIMESTAMP(3),
    "resolucionStoragePath" TEXT,
    "resolucionOriginalName" TEXT,
    "resolucionContentType" TEXT,
    "resolucionSizeBytes" INTEGER,
    "resolucionUploadedAt" TIMESTAMP(3),
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "motivoRechazo" TEXT,
    "notaRevisor" TEXT,
    "revisadoPor" TEXT,
    "resueltoPor" TEXT,
    "resueltoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstadoHistorial" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "estadoAnterior" "EstadoSolicitud",
    "estadoNuevo" "EstadoSolicitud" NOT NULL,
    "actor" TEXT NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstadoHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sequence" (
    "id" TEXT NOT NULL DEFAULT 'expediente',
    "year" INTEGER NOT NULL,
    "counter" INTEGER NOT NULL,

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_numeroExpediente_key" ON "Solicitud"("numeroExpediente");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_trackerToken_key" ON "Solicitud"("trackerToken");

-- CreateIndex
CREATE INDEX "Solicitud_estado_idx" ON "Solicitud"("estado");

-- CreateIndex
CREATE INDEX "Solicitud_cui_idx" ON "Solicitud"("cui");

-- CreateIndex
CREATE INDEX "EstadoHistorial_solicitudId_idx" ON "EstadoHistorial"("solicitudId");

-- AddForeignKey
ALTER TABLE "EstadoHistorial" ADD CONSTRAINT "EstadoHistorial_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;
