import { readErrorMessage } from "@/lib/http";
import type {
  FetchSolicitudesParams,
  FetchSolicitudesResult,
  SolicitudAccion,
  SolicitudDetail,
} from "../types";

export async function fetchSolicitudes(
  params: FetchSolicitudesParams = {}
): Promise<FetchSolicitudesResult> {
  const searchParams = new URLSearchParams();
  if (params.estado) searchParams.set("estado", params.estado);
  if (params.q) searchParams.set("q", params.q);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const query = searchParams.toString();
  const response = await fetch(`/api/solicitudes${query ? `?${query}` : ""}`);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "No se pudo cargar el listado."));
  }
  return (await response.json()) as FetchSolicitudesResult;
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
  extra?: { motivoRechazo?: string; nota?: string; archivoResolucion?: File }
): Promise<SolicitudDetail> {
  const formData = new FormData();
  formData.set("accion", accion);
  if (extra?.motivoRechazo) formData.set("motivoRechazo", extra.motivoRechazo);
  if (extra?.nota) formData.set("nota", extra.nota);
  if (extra?.archivoResolucion) formData.set("archivoResolucion", extra.archivoResolucion);

  const response = await fetch(`/api/solicitudes/${id}`, {
    method: "PATCH",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "No se pudo ejecutar la acción."));
  }
  return (await response.json()) as SolicitudDetail;
}
