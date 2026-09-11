import { CAUSALES } from "@/lib/causales";
import { DatosGrid } from "./DatosGrid";
import { DocumentoRow, type DocumentoCategoria } from "./DocumentoRow";
import type { SolicitudDetail } from "../types";

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="font-display text-sm font-bold tracking-tight text-navy-900">{titulo}</h3>
      </div>
      <div className="flex flex-col gap-2.5 p-4">{children}</div>
    </div>
  );
}

// Resumen de solo lectura de una solicitud, reutilizado por los modales de acción
// admin (iniciar revisión / aprobar / rechazar) para que luzca igual que el bloque
// equivalente en el detalle completo (`SolicitudDetailPanel`).
export function SolicitudResumen({ solicitud }: { solicitud: SolicitudDetail }) {
  const causalInfo = CAUSALES[solicitud.causal];

  const documentos: { categoria: DocumentoCategoria; label: string; url: string; originalName: string }[] = [
    { categoria: "DPI", label: "DPI", url: solicitud.dpiUrl, originalName: solicitud.dpiOriginalName },
    {
      categoria: "COMPROBANTE",
      label: "Comprobante",
      url: solicitud.comprobanteUrl,
      originalName: solicitud.comprobanteOriginalName,
    },
    ...(solicitud.autorizacionUrl
      ? [
          {
            categoria: "AUTORIZACION" as const,
            label: "Autorización / carta poder",
            url: solicitud.autorizacionUrl,
            originalName: solicitud.autorizacionOriginalName ?? "",
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <Seccion titulo="Titular">
        <DatosGrid
          filas={[
            { label: "Nombre", valor: `${solicitud.nombres} ${solicitud.apellidos}` },
            { label: "CUI", valor: solicitud.cui },
            { label: "Teléfono", valor: solicitud.telefono },
            { label: "Correo", valor: solicitud.correo },
          ]}
        />
      </Seccion>

      <Seccion titulo="Causal invocada">
        <DatosGrid
          filas={[
            {
              label: "Causal",
              valor: `${causalInfo.titulo} (${causalInfo.casilla}, GAE ${causalInfo.gae})`,
            },
            { label: "Requisito", valor: causalInfo.requisitoComprobante },
            ...(solicitud.observaciones
              ? [{ label: "Observaciones", valor: solicitud.observaciones }]
              : []),
          ]}
        />
      </Seccion>

      {solicitud.esGestionadoPorTercero && (
        <Seccion titulo="Gestor / tercero">
          <DatosGrid
            filas={[
              { label: "Nombre", valor: solicitud.gestorNombreCompleto },
              { label: "CUI", valor: solicitud.gestorCui },
              { label: "Relación con el titular", valor: solicitud.gestorRelacion },
            ]}
          />
        </Seccion>
      )}

      <Seccion titulo="Documentos adjuntos">
        {documentos.map((doc) => (
          <DocumentoRow key={doc.categoria} {...doc} />
        ))}
      </Seccion>
    </div>
  );
}
