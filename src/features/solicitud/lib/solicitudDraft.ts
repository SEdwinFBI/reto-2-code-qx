import type { SolicitudFormData } from "../types";

// Persistencia local del borrador de la solicitud en localStorage.
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

// Valida la estructura básica del borrador recuperado.
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
    // Excluye archivos adjuntos no serializables en JSON.
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
    // Ignorar si localStorage no está disponible o supera la cuota.
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
    // Ignorar si localStorage no está disponible.
  }
}
