import type { SolicitudFormData } from "../types";

/**
 * Persistencia del borrador del wizard de Solicitud en localStorage, para que el
 * progreso sobreviva una recarga o cierre accidental de la pestaña/navegador. No
 * depende del backend ni de sesión: vive por completo en el navegador del usuario.
 *
 * Versionada en la clave (`v1`) para que, si la forma de SolicitudFormData cambia en
 * el futuro, un draft antiguo simplemente deje de reconocerse en vez de restaurar
 * datos con forma incompatible.
 */
const SOLICITUD_DRAFT_STORAGE_KEY = "solicitud:draft:v1";

export type SolicitudDraftFormData = Omit<
  SolicitudFormData,
  "archivoDpi" | "archivoComprobante" | "archivoAutorizacion"
>;

export interface SolicitudDraft {
  currentStep: number;
  formData: SolicitudDraftFormData;
  savedAt: string;
}

/** Chequeo de forma mínimo, no exhaustivo — suficiente para descartar JSON corrupto o de otra versión. */
function isSolicitudDraft(value: unknown): value is SolicitudDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;
  return (
    typeof draft.currentStep === "number" &&
    typeof draft.savedAt === "string" &&
    !!draft.formData &&
    typeof draft.formData === "object" &&
    typeof (draft.formData as Record<string, unknown>).cui === "string"
  );
}

export function saveSolicitudDraft(currentStep: number, formData: SolicitudFormData): void {
  try {
    // Los campos de archivo (File) no son serializables; se excluyen explícitamente.
    const { archivoDpi, archivoComprobante, archivoAutorizacion, ...serializable } = formData;
    void archivoDpi;
    void archivoComprobante;
    void archivoAutorizacion;
    const draft: SolicitudDraft = {
      currentStep,
      formData: serializable,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(SOLICITUD_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // localStorage puede no estar disponible (modo privado) o la cuota puede estar
    // llena; el guardado del borrador es una mejora, no algo crítico — se ignora.
  }
}

export function loadSolicitudDraft(): SolicitudDraft | null {
  try {
    const raw = window.localStorage.getItem(SOLICITUD_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isSolicitudDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSolicitudDraft(): void {
  try {
    window.localStorage.removeItem(SOLICITUD_DRAFT_STORAGE_KEY);
  } catch {
    // Ignorar: no hay nada más que hacer si localStorage no está disponible.
  }
}
