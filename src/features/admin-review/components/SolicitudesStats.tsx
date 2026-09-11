import type { EstadoSolicitud } from "../types";

interface SolicitudesStatsProps {
  countsByEstado: Partial<Record<EstadoSolicitud, number>>;
}

const STATS: { estado: EstadoSolicitud; label: string; valueClassName: string }[] = [
  { estado: "PENDIENTE", label: "Pendientes", valueClassName: "text-navy-900" },
  { estado: "EN_REVISION", label: "En revisión", valueClassName: "text-brand-700" },
  { estado: "APROBADA", label: "Aprobadas", valueClassName: "text-emerald-600" },
  { estado: "RECHAZADA", label: "Rechazadas", valueClassName: "text-destructive" },
];

export function SolicitudesStats({ countsByEstado }: SolicitudesStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.estado}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
        >
          <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            {stat.label}
          </div>
          <div className={`font-display mt-1.5 text-2xl font-bold ${stat.valueClassName}`}>
            {countsByEstado[stat.estado] ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}
