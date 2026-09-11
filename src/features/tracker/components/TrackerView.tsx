"use client";

import Image from "next/image";
import { AlertCircle, Check, Download, Loader2, X } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useTrackerStatus } from "../hooks/useTrackerStatus";
import { useTrackerDocumento } from "../hooks/useTrackerDocumento";
import type { EstadoSolicitud, TrackerStatus } from "../types";

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

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PasoEstado = "completo" | "actual" | "pendiente" | "aprobado" | "rechazado";

interface TimelinePaso {
  label: string;
  fecha: string | null;
  estado: PasoEstado;
}

// Construye los pasos del timeline a partir del historial de la solicitud.
function buildTimeline(status: TrackerStatus): TimelinePaso[] {
  const fechaPorEstado = new Map(status.historial.map((h) => [h.estadoNuevo, h.createdAt]));
  const esTerminal = status.estado === "APROBADA" || status.estado === "RECHAZADA";

  const pasos: TimelinePaso[] = [
    { label: "Solicitud recibida", fecha: status.fechaRadicacion, estado: "completo" },
  ];

  const fechaEnRevision = fechaPorEstado.get("EN_REVISION") ?? null;
  if (status.estado === "EN_REVISION") {
    // Estado en curso actual.
    pasos.push({ label: "En revisión", fecha: fechaEnRevision, estado: "actual" });
  } else if (fechaEnRevision) {
    pasos.push({ label: "En revisión", fecha: fechaEnRevision, estado: "completo" });
  } else if (!esTerminal) {
    pasos.push({ label: "En revisión", fecha: null, estado: "pendiente" });
  }
  // Omitir si pasó directamente a estado terminal.

  if (status.estado === "APROBADA") {
    pasos.push({ label: "Aprobada", fecha: fechaPorEstado.get("APROBADA") ?? null, estado: "aprobado" });
  } else if (status.estado === "RECHAZADA") {
    pasos.push({ label: "Rechazada", fecha: fechaPorEstado.get("RECHAZADA") ?? null, estado: "rechazado" });
  } else {
    pasos.push({ label: "Resolución", fecha: null, estado: "pendiente" });
  }

  return pasos;
}

const PASO_CIRCULO: Record<PasoEstado, string> = {
  completo: "bg-brand-600 text-white",
  actual: "bg-brand-600 text-white ring-4 ring-brand-100",
  pendiente: "border-2 border-slate-300 bg-white text-slate-400",
  aprobado: "bg-emerald-600 text-white",
  rechazado: "bg-red-600 text-white",
};

const PASO_LINEA: Record<PasoEstado, string> = {
  completo: "bg-brand-600",
  actual: "bg-slate-200",
  pendiente: "bg-slate-200",
  aprobado: "bg-emerald-600",
  rechazado: "bg-red-600",
};

const PASO_TEXTO: Record<PasoEstado, string> = {
  completo: "text-slate-900",
  actual: "text-navy-900 font-semibold",
  pendiente: "text-slate-400",
  aprobado: "text-slate-900",
  rechazado: "text-slate-900",
};

function TrackerTimeline({ pasos }: { pasos: TimelinePaso[] }) {
  return (
    <ol className="flex flex-col">
      {pasos.map((paso, index) => {
        const esUltimo = index === pasos.length - 1;
        const Icono = paso.estado === "rechazado" ? X : paso.estado === "pendiente" ? null : Check;
        return (
          <li key={paso.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full ${PASO_CIRCULO[paso.estado]}`}
              >
                {Icono && <Icono className="size-3.5" />}
              </span>
              {!esUltimo && <span className={`w-0.5 flex-1 ${PASO_LINEA[paso.estado]}`} />}
            </div>
            <div className={esUltimo ? "pb-0.5" : "pb-6"}>
              <p className={`text-sm ${PASO_TEXTO[paso.estado]}`}>{paso.label}</p>
              {paso.fecha && <p className="text-xs text-slate-500">{formatFecha(paso.fecha)}</p>}
              {!paso.fecha && paso.estado === "actual" && (
                <p className="text-xs font-medium text-brand-700">En proceso</p>
              )}
              {!paso.fecha && paso.estado === "pendiente" && (
                <p className="text-xs text-slate-400">Pendiente</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

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

        <TrackerTimeline pasos={buildTimeline(status)} />

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
