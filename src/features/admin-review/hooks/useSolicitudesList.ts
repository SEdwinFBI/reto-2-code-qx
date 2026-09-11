"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as solicitudesAdminService from "../services/solicitudesAdminService";
import type { EstadoSolicitud, SolicitudListItem } from "../types";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_ESTADO: EstadoSolicitud | "TODAS" = "PENDIENTE";

const ESTADOS_VALIDOS: (EstadoSolicitud | "TODAS")[] = [
  "TODAS",
  "PENDIENTE",
  "EN_REVISION",
  "APROBADA",
  "RECHAZADA",
];

function parseEstadoParam(value: string | null): EstadoSolicitud | "TODAS" {
  if (value && (ESTADOS_VALIDOS as string[]).includes(value)) {
    return value as EstadoSolicitud | "TODAS";
  }
  return DEFAULT_ESTADO;
}

function parsePageParam(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

// Los filtros/búsqueda/página se sincronizan con la URL para que al volver desde el
// detalle de una solicitud (botón "Volver") la lista se restaure tal como estaba.
export function useSolicitudesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [estado, setEstadoState] = useState<EstadoSolicitud | "TODAS">(() =>
    parseEstadoParam(searchParams.get("estado"))
  );
  const [search, setSearchState] = useState(() => searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("q") ?? "");
  const [page, setPageState] = useState(() => parsePageParam(searchParams.get("page")));
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [solicitudes, setSolicitudes] = useState<SolicitudListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [countsByEstado, setCountsByEstado] = useState<Partial<Record<EstadoSolicitud, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  // Debounce del filtro de búsqueda para volver a la primera página.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPageState(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  // Refleja estado/búsqueda/página en la URL sin apilar entradas en el historial.
  useEffect(() => {
    const params = new URLSearchParams();
    if (estado !== DEFAULT_ESTADO) params.set("estado", estado);
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (page !== 1) params.set("page", String(page));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo debe reaccionar a cambios de filtros
  }, [estado, debouncedSearch, page, pathname]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial y cambios de filtro
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
    setPageState(1);
  }, []);
  const setSearch = useCallback((next: string) => setSearchState(next), []);
  const setPage = useCallback((next: number) => setPageState(next), []);
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
