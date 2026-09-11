import { readErrorMessage } from "@/lib/http";
import type { TrackerDocumento, TrackerStatus } from "../types";

export async function fetchTrackerStatus(token: string): Promise<TrackerStatus> {
  const response = await fetch(`/api/seguimiento/${token}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No se encontró ninguna solicitud con este enlace.");
    }
    throw new Error(await readErrorMessage(response, "No se pudo consultar el estado."));
  }
  return (await response.json()) as TrackerStatus;
}

/**
 * Solo devuelve una URL cuando la solicitud está APROBADA y ya tiene un
 * documento de resolución cargado; en cualquier otro caso el endpoint
 * responde 403/404 y esta función devuelve null en vez de lanzar.
 */
export async function fetchTrackerDocumento(
  token: string
): Promise<TrackerDocumento | null> {
  const response = await fetch(`/api/seguimiento/${token}/documento`);
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as TrackerDocumento;
}
