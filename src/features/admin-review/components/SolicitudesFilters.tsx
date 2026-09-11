"use client";

import { Search } from "lucide-react";
import { Input, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import type { EstadoSolicitud } from "../types";

const ESTADOS: (EstadoSolicitud | "TODAS")[] = [
  "TODAS",
  "PENDIENTE",
  "EN_REVISION",
  "APROBADA",
  "RECHAZADA",
];

const ESTADO_LABELS: Record<string, string> = {
  TODAS: "Todas",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

interface SolicitudesFiltersProps {
  estado: EstadoSolicitud | "TODAS";
  onEstadoChange: (estado: EstadoSolicitud | "TODAS") => void;
  countsByEstado: Partial<Record<EstadoSolicitud, number>>;
  totalGeneral: number;
  search: string;
  onSearchChange: (value: string) => void;
}

export function SolicitudesFilters({
  estado,
  onEstadoChange,
  countsByEstado,
  totalGeneral,
  search,
  onSearchChange,
}: SolicitudesFiltersProps) {
  function countFor(value: EstadoSolicitud | "TODAS") {
    return value === "TODAS" ? totalGeneral : countsByEstado[value] ?? 0;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={estado}
        onValueChange={(value) => onEstadoChange(value as EstadoSolicitud | "TODAS")}
        className="overflow-x-auto"
      >
        <TabsList className="h-auto p-1">
          {ESTADOS.map((e) => (
            <TabsTrigger key={e} value={e} className="gap-1.5 px-3 py-1.5">
              <span>{ESTADO_LABELS[e]}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground group-data-active/tabs-list:bg-background/60">
                {countFor(e)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por DPI, nombre o expediente…"
          className="pl-8 focus-visible:border-brand-600 focus-visible:ring-brand-600/30"
        />
      </div>
    </div>
  );
}
