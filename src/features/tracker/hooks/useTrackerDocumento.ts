"use client";

import { useEffect, useState } from "react";
import { fetchTrackerDocumento } from "../services/trackerService";
import type { TrackerDocumento } from "../types";

// Consulta el documento de resolución cuando la solicitud está aprobada.
export function useTrackerDocumento(token: string, habilitado: boolean) {
  const [documento, setDocumento] = useState<TrackerDocumento | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!habilitado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicio al cambiar de estado
      setDocumento(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchTrackerDocumento(token)
      .then((data) => {
        if (!cancelled) setDocumento(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, habilitado]);

  return { documento, isLoading };
}
