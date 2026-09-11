import { readErrorMessage } from "@/lib/http";
import type { TrackerStatus } from "../types";

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
