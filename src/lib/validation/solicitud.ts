import { z } from "zod";
import { CAUSAL_KEYS } from "@/lib/causales";

export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const causalEnum = z.enum(CAUSAL_KEYS as [string, ...string[]]);

/**
 * Validación del cuerpo (campos, no archivos) de una solicitud de exoneración.
 * Compartida entre el Route Handler y, eventualmente, el wizard cliente.
 */
export const solicitudFormSchema = z
  .object({
    cui: z.string().regex(/^\d{13}$/, "CUI debe tener 13 dígitos"),
    nombres: z.string().min(2, "Nombres es obligatorio"),
    apellidos: z.string().min(2, "Apellidos es obligatorio"),
    telefono: z.string().min(8, "Teléfono inválido"),
    correo: z.string().email("Correo inválido"),
    causal: causalEnum,
    fechaVencimiento: z.string().min(1, "Fecha de vencimiento es obligatoria"),
    fechaHecho: z.string().min(1, "Fecha del hecho es obligatoria"),
    observaciones: z.string().optional(),

    esGestionadoPorTercero: z.coerce.boolean().default(false),
    gestorNombreCompleto: z.string().min(2).optional(),
    gestorCui: z.string().regex(/^\d{13}$/).optional(),
    gestorRelacion: z.string().min(2).optional(),
    gestorTelefono: z.string().min(8).optional(),
    gestorCorreo: z.string().email().optional(),

    esEmpleadoGobierno: z.coerce.boolean().default(false),
    empleadoPuesto: z.string().min(2).optional(),
    empleadoInstitucion: z.string().min(2).optional(),
  })
  .refine(
    (data) =>
      !data.esGestionadoPorTercero ||
      (data.gestorNombreCompleto &&
        data.gestorCui &&
        data.gestorRelacion &&
        data.gestorCorreo &&
        data.gestorTelefono),
    {
      message:
        "Si el trámite lo gestiona un tercero, sus datos completos son obligatorios",
      path: ["gestorNombreCompleto"],
    }
  )
  .refine(
    (data) =>
      !data.esEmpleadoGobierno || (data.empleadoPuesto && data.empleadoInstitucion),
    {
      message: "Si es empleado de gobierno, puesto e institución son obligatorios",
      path: ["empleadoPuesto"],
    }
  );

export type SolicitudFormInput = z.infer<typeof solicitudFormSchema>;

/**
 * Validación del cuerpo de la consulta simulada de identidad (paso 1 del wizard).
 * La `serie` del DPI se valida como 4 dígitos (ej. "1234").
 */
export const consultaPersonaSchema = z.object({
  cui: z.string().regex(/^\d{13}$/, "CUI debe tener 13 dígitos"),
  fechaNacimiento: z.string().min(1, "Fecha de nacimiento es obligatoria"),
  serie: z.string().regex(/^\d{4}$/, "Serie inválida: debe ser 4 dígitos"),
});

export type ConsultaPersonaInput = z.infer<typeof consultaPersonaSchema>;

/**
 * Forma de cada perfil de prueba en src/data/perfiles-prueba.json, y por lo tanto de
 * la respuesta exitosa de POST /api/consulta-persona. Refleja 1:1 los nombres de
 * campo de SolicitudFormData (excepto los de archivo, que nunca se prerellenan).
 */
export interface PerfilPrueba {
  id: string;
  genero: string;
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
  causal: string;
  fechaVencimiento: string;
  fechaHecho: string;
  numerosDocumento: string[];
  observaciones: string;
  esGestionadoPorTercero: boolean;
  gestorNombreCompleto: string;
  gestorCui: string;
  gestorRelacion: string;
  gestorTelefono: string;
  gestorCorreo: string;
  esEmpleadoGobierno: boolean;
  empleadoPuesto: string;
  empleadoInstitucion: string;
}

export function validateFile(
  file: File | null | undefined,
  { required, label }: { required: boolean; label: string }
): string | null {
  if (!file) {
    return required ? `${label} es obligatorio` : null;
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `${label} debe ser PDF, JPG o PNG`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${label} no debe superar 5 MB`;
  }
  return null;
}
