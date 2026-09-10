export type CausalTipo = "24" | "25" | "26";

export interface SolicitudFormData {
  cui: string;
  fechaNacimiento: string;
  serie: string;
  nacionalidad: string;
  numeroLicencia: string;
  paisEmisionLicencia: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  causal: CausalTipo;
  fechaVencimiento: string;
  fechaHecho: string;
  observaciones: string;
  archivoFormulario?: string;
  archivoDpi?: string;
  archivoComprobante?: string;
}

export interface SolicitudResult {
  numeroExpediente: string;
  fechaRadicacion: string;
  plazoDiasHabiles: number;
  causalNombre: string;
}
