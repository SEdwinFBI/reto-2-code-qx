"use client";

import { useCallback, useEffect, useState } from "react";
import * as solicitudesAdminService from "../services/solicitudesAdminService";
import type { SolicitudAccion, SolicitudDetail } from "../types";

export function useSolicitudDetail(id: string) {
  const [solicitud, setSolicitud] = useState<SolicitudDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingAccion, setIsSubmittingAccion] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del detalle por id
    setIsLoading(true);
    setError(null);

    solicitudesAdminService
      .fetchSolicitudDetail(id)
      .then((data) => {
        if (!cancelled) setSolicitud(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar la solicitud.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadIndex]);

  const reload = useCallback(() => setReloadIndex((n) => n + 1), []);

  async function ejecutarAccion(
    accion: SolicitudAccion,
    extra?: { motivoRechazo?: string; nota?: string; archivoResolucion?: File }
  ) {
    setIsSubmittingAccion(true);
    setError(null);
    try {
      const updated = await solicitudesAdminService.ejecutarAccion(id, accion, extra);
      setSolicitud(updated);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo ejecutar la acción.");
      return false;
    } finally {
      setIsSubmittingAccion(false);
    }
  }

  return { solicitud, isLoading, error, ejecutarAccion, isSubmittingAccion, reload };
}
