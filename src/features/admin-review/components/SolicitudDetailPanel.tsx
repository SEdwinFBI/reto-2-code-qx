"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button, FormTextarea } from "@/components/ui";
import { EstadoTimeline } from "@/components/feedback/EstadoTimeline";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";
import { DatosGrid } from "./DatosGrid";
import { DocumentoRow, type DocumentoCategoria } from "./DocumentoRow";
import { EstadoBadge } from "./EstadoBadge";

function SeccionCard({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-display text-sm font-bold tracking-tight text-navy-900">{titulo}</h2>
        {subtitulo && <p className="mt-0.5 text-xs text-slate-500">{subtitulo}</p>}
      </div>
      <div className="flex flex-col gap-3 p-5">{children}</div>
    </div>
  );
}

export function SolicitudDetailPanel({ id }: { id: string }) {
  const router = useRouter();
  const { solicitud, isLoading, error, ejecutarAccion, isSubmittingAccion } =
    useSolicitudDetail(id);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [nota, setNota] = useState("");
  const [archivoResolucion, setArchivoResolucion] = useState<File | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!solicitud) return null;

  async function handleAccion(accion: "iniciar_revision" | "aprobar" | "rechazar") {
    if (accion === "rechazar" && !motivoRechazo.trim()) {
      toast.error("Debe indicar el motivo de rechazo.");
      return;
    }
    if (accion === "aprobar" && !archivoResolucion) {
      toast.error("Debe adjuntar el documento de resolución/exoneración.");
      return;
    }
    const ok = await ejecutarAccion(accion, {
      motivoRechazo: accion === "rechazar" ? motivoRechazo : undefined,
      nota: nota || undefined,
      archivoResolucion: accion === "aprobar" ? (archivoResolucion ?? undefined) : undefined,
    });
    if (ok) {
      toast.success(
        accion === "iniciar_revision"
          ? "Solicitud marcada en revisión."
          : accion === "aprobar"
            ? "Solicitud aprobada. Se notificó al solicitante."
            : "Solicitud rechazada. Se notificó al solicitante."
      );
      setMotivoRechazo("");
      setArchivoResolucion(null);
    } else {
      toast.error("No se pudo ejecutar la acción.");
    }
  }

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
    ...(solicitud.resolucionUrl
      ? [
          {
            categoria: "RESOLUCION" as const,
            label: "Resolución / exoneración",
            url: solicitud.resolucionUrl,
            originalName: solicitud.resolucionOriginalName ?? "",
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-5">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-tight text-navy-900">
          {solicitud.numeroExpediente}
        </h1>
        <EstadoBadge estado={solicitud.estado} />
      </div>

      <SeccionCard titulo="Titular">
        <DatosGrid
          filas={[
            { label: "Nombre", valor: `${solicitud.nombres} ${solicitud.apellidos}` },
            { label: "CUI", valor: solicitud.cui },
            { label: "Teléfono", valor: solicitud.telefono },
            { label: "Correo", valor: solicitud.correo },
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
      </SeccionCard>

      {solicitud.esGestionadoPorTercero && (
        <SeccionCard titulo="Gestor / tercero">
          <DatosGrid
            filas={[
              { label: "Nombre", valor: solicitud.gestorNombreCompleto },
              { label: "CUI", valor: solicitud.gestorCui },
              { label: "Relación con el titular", valor: solicitud.gestorRelacion },
              { label: "Teléfono", valor: solicitud.gestorTelefono },
              { label: "Correo", valor: solicitud.gestorCorreo },
            ]}
          />
        </SeccionCard>
      )}

      {solicitud.esEmpleadoGobierno && (
        <SeccionCard titulo="Empleado de gobierno">
          <DatosGrid
            filas={[
              { label: "Puesto", valor: solicitud.empleadoPuesto },
              { label: "Institución", valor: solicitud.empleadoInstitucion },
            ]}
          />
        </SeccionCard>
      )}

      <SeccionCard
        titulo="Documentos"
        subtitulo="Comprobantes y respaldos adjuntos al expediente"
      >
        {documentos.map((doc) => (
          <DocumentoRow key={doc.categoria} {...doc} />
        ))}
      </SeccionCard>

      {(solicitud.estado === "PENDIENTE" || solicitud.estado === "EN_REVISION") && (
        <SeccionCard
          titulo="Acciones de revisión"
          subtitulo="Adjunte la resolución solo si va a aprobar. El motivo es obligatorio solo si va a rechazar."
        >
          <div className="flex flex-col gap-4">
            <FormTextarea
              label="Nota interna (opcional)"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />

            <FormTextarea
              label="Motivo de rechazo (obligatorio solo si rechaza)"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
            />

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                Documento de resolución/exoneración (obligatorio solo si aprueba)
              </span>
              <label className="w-fit cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => setArchivoResolucion(e.target.files?.[0] ?? null)}
                />
                {archivoResolucion ? (
                  <span className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-100 px-3 text-sm font-medium text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Adjunto
                  </span>
                ) : (
                  <span className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-input px-3 text-sm font-medium hover:bg-muted">
                    <Upload className="w-3.5 h-3.5" /> Subir
                  </span>
                )}
              </label>
              {archivoResolucion && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {archivoResolucion.name}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              {solicitud.estado === "PENDIENTE" && (
                <Button
                  variant="secondary"
                  disabled={isSubmittingAccion}
                  onClick={() => handleAccion("iniciar_revision")}
                >
                  Marcar en revisión
                </Button>
              )}
              <Button
                disabled={isSubmittingAccion || !archivoResolucion}
                onClick={() => handleAccion("aprobar")}
              >
                Aprobar
              </Button>
              <Button
                variant="destructive"
                disabled={isSubmittingAccion || !motivoRechazo.trim()}
                onClick={() => handleAccion("rechazar")}
              >
                Rechazar
              </Button>
            </div>
          </div>
        </SeccionCard>
      )}

      {solicitud.motivoRechazo && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold tracking-wide text-red-800 uppercase">
            Motivo de rechazo
          </p>
          <p className="mt-1 text-sm text-red-700">{solicitud.motivoRechazo}</p>
        </div>
      )}

      <SeccionCard titulo="Historial del trámite">
        <EstadoTimeline
          estado={solicitud.estado}
          historial={solicitud.historial}
          fechaRadicacion={solicitud.createdAt}
        />
      </SeccionCard>
    </div>
  );
}
