"use client";

import { useEffect, useState } from "react";
import { fetchTrackerStatus } from "../services/trackerService";
import type { TrackerStatus } from "../types";

export function useTrackerStatus(token: string) {
  const [status, setStatus] = useState<TrackerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTrackerStatus(token);
        if (!cancelled) setStatus(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al consultar el estado.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { status, isLoading, error };
}
