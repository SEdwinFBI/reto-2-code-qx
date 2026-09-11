import type { CausalKey } from "@/lib/causales";

export type CausalTipo = CausalKey;

export interface SolicitudFormData {
  tramitaTercero: boolean;
  terceroCui: string;
  terceroNombreCompleto: string;
  terceroParentesco: string;
  terceroCorreo: string;
  terceroTelefono: string;
  esTrabajadorPublico: boolean;
  solicitaAbogado: boolean;
  institucionYPuesto: string;
  numeroColegiadoActivo: string;
  cui: string;
  fechaNacimiento: string;
  serie: string;
  nacionalidad: string;
  numeroLicencia: string;
  paisEmisionLicencia: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefonoAlternativo: string;
  correo: string;
  causal: CausalTipo;
  numerosDocumento: string[];
  observaciones: string;

  archivoDpi?: File | null;
  archivoComprobante?: File | null;

  /** Requerido si esGestionadoPorTercero es true. */
  archivoAutorizacion?: File | null;

  /** Trámite presentado por titular o tercero autorizado. */
  esGestionadoPorTercero: boolean;
  gestorNombreCompleto?: string;
  gestorCui?: string;
  gestorRelacion?: string;
  gestorTelefono?: string;
  gestorCorreo?: string;

  /** Información laboral del solicitante (opcional). */
  esEmpleadoGobierno: boolean;
  empleadoPuesto?: string;
  empleadoInstitucion?: string;
}

export interface SolicitudResult {
  numeroExpediente: string;
  fechaRadicacion: string;
  plazoDiasHabiles: number;
  causalNombre: string;
  /** Enlace público para consultar el estado del trámite. */
  urlSeguimiento: string;
}

export type SolicitudApiResponse = SolicitudResult;
