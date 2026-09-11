import { readErrorMessage } from "@/lib/http";
import type {
  EstadoSolicitud,
  SolicitudAccion,
  SolicitudDetail,
  SolicitudListItem,
} from "../types";

export async function fetchSolicitudes(estado?: EstadoSolicitud): Promise<SolicitudListItem[]> {
  const url = estado ? `/api/solicitudes?estado=${estado}` : "/api/solicitudes";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "No se pudo cargar el listado."));
  }
  const data = await response.json();
  return data.solicitudes as SolicitudListItem[];
}

export async function fetchSolicitudDetail(id: string): Promise<SolicitudDetail> {
  const response = await fetch(`/api/solicitudes/${id}`);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "No se pudo cargar el detalle."));
  }
  return (await response.json()) as SolicitudDetail;
}

export async function ejecutarAccion(
  id: string,
  accion: SolicitudAccion,
  extra?: { motivoRechazo?: string; nota?: string }
): Promise<SolicitudDetail> {
  const response = await fetch(`/api/solicitudes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accion, ...extra }),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "No se pudo ejecutar la acción."));
  }
  return (await response.json()) as SolicitudDetail;
}
