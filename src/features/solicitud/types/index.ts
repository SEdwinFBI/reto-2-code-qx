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

  /** Solo relevante si esGestionadoPorTercero es true. */
  archivoAutorizacion?: File | null;

  /** El trámite lo puede presentar el titular o un tercero (familiar/abogado/apoderado). */
  esGestionadoPorTercero: boolean;
  gestorNombreCompleto?: string;
  gestorCui?: string;
  gestorRelacion?: string;
  gestorTelefono?: string;
  gestorCorreo?: string;

  /** Dato opcional del solicitante/gestor, no del revisor. */
  esEmpleadoGobierno: boolean;
  empleadoPuesto?: string;
  empleadoInstitucion?: string;
}

export interface SolicitudResult {
  numeroExpediente: string;
  fechaRadicacion: string;
  plazoDiasHabiles: number;
  causalNombre: string;
  /** Link público para consultar el estado sin necesidad de credenciales. */
  urlSeguimiento: string;
}

export type SolicitudApiResponse = SolicitudResult;
