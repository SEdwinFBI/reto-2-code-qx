import { Card } from "@/components/ui";
import type { EstadoSolicitud } from "../types";

interface SolicitudesStatsProps {
  countsByEstado: Partial<Record<EstadoSolicitud, number>>;
}

const STATS: { estado: EstadoSolicitud; label: string; valueClassName: string }[] = [
  { estado: "PENDIENTE", label: "Pendientes", valueClassName: "text-foreground" },
  { estado: "EN_REVISION", label: "En revisión", valueClassName: "text-brand-700" },
  { estado: "APROBADA", label: "Aprobadas", valueClassName: "text-emerald-800" },
  { estado: "RECHAZADA", label: "Rechazadas", valueClassName: "text-destructive" },
];

export function SolicitudesStats({ countsByEstado }: SolicitudesStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {STATS.map((stat) => (
        <Card key={stat.estado} className="p-4">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {stat.label}
          </div>
          <div className={`font-display mt-1.5 text-2xl font-bold ${stat.valueClassName}`}>
            {countsByEstado[stat.estado] ?? 0}
          </div>
        </Card>
      ))}
    </div>
  );
}
