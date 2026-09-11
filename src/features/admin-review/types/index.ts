import type { CausalKey } from "@/lib/causales";

export type EstadoSolicitud = "PENDIENTE" | "EN_REVISION" | "APROBADA" | "RECHAZADA";

export interface SolicitudListItem {
  id: string;
  numeroExpediente: string;
  nombres: string;
  apellidos: string;
  causal: CausalKey;
  estado: EstadoSolicitud;
  esGestionadoPorTercero: boolean;
  gestorNombreCompleto: string | null;
  gestorRelacion: string | null;
  esEmpleadoGobierno: boolean;
  createdAt: string;
}

export interface EstadoHistorialItem {
  id: string;
  estadoAnterior: EstadoSolicitud | null;
  estadoNuevo: EstadoSolicitud;
  actor: string;
  nota: string | null;
  createdAt: string;
}

export interface SolicitudDetail {
  id: string;
  numeroExpediente: string;
  trackerToken: string;
  cui: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  causal: CausalKey;
  fechaVencimiento: string;
  fechaHecho: string;
  observaciones: string | null;

  esGestionadoPorTercero: boolean;
  gestorNombreCompleto: string | null;
  gestorCui: string | null;
  gestorRelacion: string | null;
  gestorTelefono: string | null;
  gestorCorreo: string | null;

  esEmpleadoGobierno: boolean;
  empleadoPuesto: string | null;
  empleadoInstitucion: string | null;

  dpiUrl: string;
  dpiOriginalName: string;
  comprobanteUrl: string;
  comprobanteOriginalName: string;
  autorizacionUrl: string | null;
  autorizacionOriginalName: string | null;

  estado: EstadoSolicitud;
  motivoRechazo: string | null;
  notaRevisor: string | null;
  revisadoPor: string | null;
  resueltoPor: string | null;
  resueltoEn: string | null;

  createdAt: string;
  updatedAt: string;
  historial: EstadoHistorialItem[];
}

export type SolicitudAccion = "iniciar_revision" | "aprobar" | "rechazar";
