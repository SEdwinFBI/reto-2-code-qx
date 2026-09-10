export type CausalTipo = "24" | "25" | "26";

export type TipoLicencia = "A" | "B" | "C" | "M" | "E";

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
  tipoLicencia: TipoLicencia | "";
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
