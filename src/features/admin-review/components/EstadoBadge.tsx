import { Badge } from "@/components/ui";
import type { EstadoSolicitud } from "../types";

const ESTADO_CONFIG: Record<EstadoSolicitud, { label: string; variant: "secondary" | "blue" | "green" | "destructive" }> = {
  PENDIENTE: { label: "Pendiente", variant: "secondary" },
  EN_REVISION: { label: "En revisión", variant: "blue" },
  APROBADA: { label: "Aprobada", variant: "green" },
  RECHAZADA: { label: "Rechazada", variant: "destructive" },
};

export function EstadoBadge({ estado }: { estado: EstadoSolicitud }) {
  const config = ESTADO_CONFIG[estado];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
