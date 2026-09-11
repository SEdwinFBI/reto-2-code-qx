import type { CausalKey } from "@/lib/causales";

export type EstadoSolicitud = "PENDIENTE" | "EN_REVISION" | "APROBADA" | "RECHAZADA";

export interface TrackerHistorialItem {
  estadoNuevo: EstadoSolicitud;
  createdAt: string;
}

export interface TrackerStatus {
  numeroExpediente: string;
  causal: CausalKey;
  causalNombre: string;
  estado: EstadoSolicitud;
  motivoRechazo: string | null;
  fechaRadicacion: string;
  plazoDiasHabiles: number;
  historial: TrackerHistorialItem[];
}

export interface TrackerDocumento {
  url: string;
  nombreArchivo: string | null;
}
