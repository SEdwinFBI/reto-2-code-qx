import type { ReactNode } from "react";

export interface DatosGridFila {
  label: string;
  valor: ReactNode;
}

// Bloque clave-valor reutilizado en el detalle de una solicitud y en los modales
// de acción admin (mismo patrón que el bloque de metadatos del expediente en el tracker).
export function DatosGrid({ filas }: { filas: DatosGridFila[] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
      {filas.map((fila, index) => (
        <div
          key={fila.label}
          className={`flex items-center justify-between gap-3 border-slate-200/70 pb-2 ${
            index === filas.length - 1 ? "" : "border-b"
          } ${index === 0 ? "" : "pt-2"}`}
        >
          <span className="text-slate-500">{fila.label}</span>
          <span className="text-right font-medium text-navy-900">{fila.valor}</span>
        </div>
      ))}
    </div>
  );
}
