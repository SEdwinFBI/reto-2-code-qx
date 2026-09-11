import { Check, X } from "lucide-react";

// Duplicado intencionalmente aquí (en vez de importado de una feature) para que este
// componente de UI genérica no dependa de un módulo de dominio.
export type EstadoSolicitud = "PENDIENTE" | "EN_REVISION" | "APROBADA" | "RECHAZADA";

const ESTADO_HISTORIAL_LABEL: Record<EstadoSolicitud, string> = {
  PENDIENTE: "Solicitud recibida",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PasoEstado = "completo" | "actual" | "pendiente" | "aprobado" | "rechazado";

interface TimelinePaso {
  label: string;
  fecha: string | null;
  estado: PasoEstado;
}

export interface EstadoTimelineHistorialItem {
  estadoNuevo: EstadoSolicitud;
  createdAt: string;
}

export interface EstadoTimelineProps {
  estado: EstadoSolicitud;
  historial: EstadoTimelineHistorialItem[];
  fechaRadicacion: string;
}

// Construye los pasos del timeline a partir del historial de la solicitud.
function buildTimeline({ estado, historial, fechaRadicacion }: EstadoTimelineProps): TimelinePaso[] {
  const fechaPorEstado = new Map(historial.map((h) => [h.estadoNuevo, h.createdAt]));
  const esTerminal = estado === "APROBADA" || estado === "RECHAZADA";

  const pasos: TimelinePaso[] = [
    { label: "Solicitud recibida", fecha: fechaRadicacion, estado: "completo" },
  ];

  const fechaEnRevision = fechaPorEstado.get("EN_REVISION") ?? null;
  if (estado === "EN_REVISION") {
    // Estado en curso actual.
    pasos.push({ label: ESTADO_HISTORIAL_LABEL.EN_REVISION, fecha: fechaEnRevision, estado: "actual" });
  } else if (fechaEnRevision) {
    pasos.push({ label: ESTADO_HISTORIAL_LABEL.EN_REVISION, fecha: fechaEnRevision, estado: "completo" });
  } else if (!esTerminal) {
    pasos.push({ label: ESTADO_HISTORIAL_LABEL.EN_REVISION, fecha: null, estado: "pendiente" });
  }
  // Omitir si pasó directamente a estado terminal.

  if (estado === "APROBADA") {
    pasos.push({ label: "Aprobada", fecha: fechaPorEstado.get("APROBADA") ?? null, estado: "aprobado" });
  } else if (estado === "RECHAZADA") {
    pasos.push({ label: "Rechazada", fecha: fechaPorEstado.get("RECHAZADA") ?? null, estado: "rechazado" });
  } else {
    pasos.push({ label: "Resolución", fecha: null, estado: "pendiente" });
  }

  return pasos;
}

const PASO_CIRCULO: Record<PasoEstado, string> = {
  completo: "bg-brand-600 text-white",
  actual: "bg-brand-600 text-white ring-4 ring-brand-100",
  pendiente: "border-2 border-slate-300 bg-white text-slate-400",
  aprobado: "bg-emerald-600 text-white",
  rechazado: "bg-red-600 text-white",
};

const PASO_LINEA: Record<PasoEstado, string> = {
  completo: "bg-brand-600",
  actual: "bg-slate-200",
  pendiente: "bg-slate-200",
  aprobado: "bg-emerald-600",
  rechazado: "bg-red-600",
};

const PASO_TEXTO: Record<PasoEstado, string> = {
  completo: "text-slate-900",
  actual: "text-navy-900 font-semibold",
  pendiente: "text-slate-400",
  aprobado: "text-slate-900",
  rechazado: "text-slate-900",
};

// Timeline visual del historial de estados de una solicitud (usado en el tracker
// público y en el panel de administración).
export function EstadoTimeline(props: EstadoTimelineProps) {
  const pasos = buildTimeline(props);

  return (
    <ol className="flex flex-col">
      {pasos.map((paso, index) => {
        const esUltimo = index === pasos.length - 1;
        const Icono = paso.estado === "rechazado" ? X : paso.estado === "pendiente" ? null : Check;
        return (
          <li key={paso.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full ${PASO_CIRCULO[paso.estado]}`}
              >
                {Icono && <Icono className="size-3.5" />}
              </span>
              {!esUltimo && <span className={`w-0.5 flex-1 ${PASO_LINEA[paso.estado]}`} />}
            </div>
            <div className={esUltimo ? "pb-0.5" : "pb-6"}>
              <p className={`text-sm ${PASO_TEXTO[paso.estado]}`}>{paso.label}</p>
              {paso.fecha && <p className="text-xs text-slate-500">{formatFecha(paso.fecha)}</p>}
              {!paso.fecha && paso.estado === "actual" && (
                <p className="text-xs font-medium text-brand-700">En proceso</p>
              )}
              {!paso.fecha && paso.estado === "pendiente" && (
                <p className="text-xs text-slate-400">Pendiente</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
