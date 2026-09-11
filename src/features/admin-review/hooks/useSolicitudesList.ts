"use client";

import { useCallback, useEffect, useState } from "react";
import * as solicitudesAdminService from "../services/solicitudesAdminService";
import type { EstadoSolicitud, SolicitudListItem } from "../types";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useSolicitudesList(initialEstado: EstadoSolicitud | "TODAS" = "PENDIENTE") {
  const [estado, setEstadoState] = useState<EstadoSolicitud | "TODAS">(initialEstado);
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [solicitudes, setSolicitudes] = useState<SolicitudListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [countsByEstado, setCountsByEstado] = useState<Partial<Record<EstadoSolicitud, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  // Debounce del texto de búsqueda antes de disparar el fetch; al aplicarse,
  // vuelve a la primera página.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/param-change, no data-fetch library available
    setIsLoading(true);
    setError(null);

    solicitudesAdminService
      .fetchSolicitudes({
        estado: estado === "TODAS" ? undefined : estado,
        q: debouncedSearch || undefined,
        page,
        pageSize,
      })
      .then((data) => {
        if (cancelled) return;
        setSolicitudes(data.solicitudes);
        setTotal(data.total);
        setCountsByEstado(data.countsByEstado);
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
  }, [estado, debouncedSearch, page, pageSize, reloadIndex]);

  const setEstado = useCallback((next: EstadoSolicitud | "TODAS") => {
    setEstadoState(next);
    setPage(1);
  }, []);
  const setSearch = useCallback((next: string) => setSearchState(next), []);
  const reload = useCallback(() => setReloadIndex((n) => n + 1), []);

  return {
    solicitudes,
    estado,
    setEstado,
    search,
    setSearch,
    page,
    pageSize,
    total,
    setPage,
    countsByEstado,
    isLoading,
    error,
    reload,
  };
}
