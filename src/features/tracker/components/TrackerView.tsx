"use client";

import Image from "next/image";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { EstadoTimeline } from "@/components/feedback/EstadoTimeline";
import { useTrackerStatus } from "../hooks/useTrackerStatus";
import { useTrackerDocumento } from "../hooks/useTrackerDocumento";
import type { EstadoSolicitud } from "../types";

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente de revisión",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

const ESTADO_BADGE_VARIANT: Record<EstadoSolicitud, "outline" | "blue" | "green" | "destructive"> = {
  PENDIENTE: "outline",
  EN_REVISION: "blue",
  APROBADA: "green",
  RECHAZADA: "destructive",
};

function TrackerBrandMark() {
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-gold-500/70 shadow-sm">
        <Image
          src="/images.jpg"
          alt="Escudo Nacional de Guatemala"
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h1 className="truncate font-display text-base font-bold tracking-tight text-navy-900 sm:text-lg">
          Consulta de mi trámite
        </h1>
        <p className="truncate text-xs font-medium text-slate-500">
          Departamento de Tránsito · Policía Nacional Civil
        </p>
      </div>
    </div>
  );
}

export function TrackerView({ token }: { token: string }) {
  const { status, isLoading, error } = useTrackerStatus(token);
  const { documento, isLoading: isLoadingDocumento } = useTrackerDocumento(
    token,
    status?.estado === "APROBADA"
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <TrackerBrandMark />
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" />
          <p className="text-sm text-slate-600">Consultando estado…</p>
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="flex flex-col gap-4">
        <TrackerBrandMark />
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <AlertCircle className="size-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">
            {error ?? "No se encontró la solicitud."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TrackerBrandMark />
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-navy-900">Seguimiento de solicitud</h2>
          <Badge variant={ESTADO_BADGE_VARIANT[status.estado]} className="shrink-0">
            {ESTADO_LABELS[status.estado]}
          </Badge>
        </div>

        <EstadoTimeline
          estado={status.estado}
          historial={status.historial}
          fechaRadicacion={status.fechaRadicacion}
        />

        <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
          <div className="flex justify-between gap-3 border-b border-slate-200/70 pb-2">
            <span className="text-slate-500">No. Expediente:</span>
            <span className="font-mono font-bold text-brand-700">{status.numeroExpediente}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-slate-200/70 pb-2">
            <span className="text-slate-500">Causal:</span>
            <span className="font-semibold text-slate-800">{status.causalNombre}</span>
          </div>
          {(status.estado === "PENDIENTE" || status.estado === "EN_REVISION") && (
            <div className="flex justify-between gap-3 pt-1">
              <span className="text-slate-500">Plazo estimado de resolución:</span>
              <span className="font-bold text-brand-700">{status.plazoDiasHabiles} días hábiles</span>
            </div>
          )}
        </div>

        {status.estado === "RECHAZADA" && status.motivoRechazo && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
            <span className="font-semibold">Motivo de rechazo:</span> {status.motivoRechazo}
          </div>
        )}

        {status.estado === "APROBADA" && (
          <>
            {isLoadingDocumento && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin text-brand-600" />
                Preparando documento…
              </div>
            )}
            {!isLoadingDocumento && documento && (
              <Button
                className="w-fit gap-2"
                onClick={() => window.open(documento.url, "_blank", "noopener,noreferrer")}
              >
                <Download className="size-4" />
                Descargar documento de exoneración
              </Button>
            )}
            {!isLoadingDocumento && !documento && (
              <p className="text-sm text-slate-500">
                El documento aún no está disponible. Intente más tarde.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
