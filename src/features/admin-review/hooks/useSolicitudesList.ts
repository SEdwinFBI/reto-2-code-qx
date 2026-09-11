"use client";

import { useCallback, useEffect, useState } from "react";
import * as solicitudesAdminService from "../services/solicitudesAdminService";
import type { EstadoSolicitud, SolicitudListItem } from "../types";

export function useSolicitudesList(initialEstado: EstadoSolicitud | "TODAS" = "PENDIENTE") {
  const [estado, setEstado] = useState<EstadoSolicitud | "TODAS">(initialEstado);
  const [solicitudes, setSolicitudes] = useState<SolicitudListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/param-change, no data-fetch library available
    setIsLoading(true);
    setError(null);

    solicitudesAdminService
      .fetchSolicitudes(estado === "TODAS" ? undefined : estado)
      .then((data) => {
        if (!cancelled) setSolicitudes(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar solicitudes.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [estado, reloadIndex]);

  const reload = useCallback(() => setReloadIndex((n) => n + 1), []);

  return { solicitudes, estado, setEstado, isLoading, error, reload };
}
