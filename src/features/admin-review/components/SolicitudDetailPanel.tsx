"use client";

import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, FormTextarea } from "@/components/ui";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";
import { EstadoBadge } from "./EstadoBadge";

export function SolicitudDetailPanel({ id }: { id: string }) {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-semibold">{solicitud.numeroExpediente}</h1>
        <EstadoBadge estado={solicitud.estado} />
      </div>

      <Card>
        <CardHeader className="border-b [.border-b]:pb-3">
          <CardTitle className="font-display">Titular</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>
            {solicitud.nombres} {solicitud.apellidos} — CUI {solicitud.cui}
          </p>
          <p>Teléfono: {solicitud.telefono}</p>
          <p>Correo: {solicitud.correo}</p>
          <p>
            Causal: {causalInfo.titulo} ({causalInfo.casilla}, GAE {causalInfo.gae})
          </p>
          <p>Requisito: {causalInfo.requisitoComprobante}</p>
          {solicitud.observaciones && <p>Observaciones: {solicitud.observaciones}</p>}
        </CardContent>
      </Card>

      {solicitud.esGestionadoPorTercero && (
        <Card>
          <CardHeader className="border-b [.border-b]:pb-3">
            <CardTitle className="font-display">Gestor / tercero</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p>
              {solicitud.gestorNombreCompleto} — CUI {solicitud.gestorCui}
            </p>
            <p>Relación con el titular: {solicitud.gestorRelacion}</p>
            <p>Teléfono: {solicitud.gestorTelefono}</p>
            <p>Correo: {solicitud.gestorCorreo}</p>
          </CardContent>
        </Card>
      )}

      {solicitud.esEmpleadoGobierno && (
        <Card>
          <CardHeader className="border-b [.border-b]:pb-3">
            <CardTitle className="font-display">Empleado de gobierno</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p>Puesto: {solicitud.empleadoPuesto}</p>
            <p>Institución: {solicitud.empleadoInstitucion}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b [.border-b]:pb-3">
          <CardTitle className="font-display">Documentos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <a href={solicitud.dpiUrl} target="_blank" rel="noopener noreferrer" className="underline">
            DPI — {solicitud.dpiOriginalName}
          </a>
          <a
            href={solicitud.comprobanteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Comprobante — {solicitud.comprobanteOriginalName}
          </a>
          {solicitud.autorizacionUrl && (
            <a
              href={solicitud.autorizacionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Autorización / carta poder — {solicitud.autorizacionOriginalName}
            </a>
          )}
          {solicitud.resolucionUrl && (
            <a
              href={solicitud.resolucionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Resolución / exoneración — {solicitud.resolucionOriginalName}
            </a>
          )}
        </CardContent>
      </Card>

      {(solicitud.estado === "PENDIENTE" || solicitud.estado === "EN_REVISION") && (
        <Card>
          <CardHeader className="border-b [.border-b]:pb-3">
            <CardTitle className="font-display">Acciones de revisión</CardTitle>
            <p className="text-xs text-muted-foreground">
              Adjunte la resolución solo si va a aprobar. El motivo es obligatorio solo si va a
              rechazar.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
          </CardContent>
        </Card>
      )}

      {solicitud.motivoRechazo && (
        <Card>
          <CardHeader className="border-b [.border-b]:pb-3">
            <CardTitle className="font-display">Motivo de rechazo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{solicitud.motivoRechazo}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b [.border-b]:pb-3">
          <CardTitle className="font-display">Historial</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {solicitud.historial.map((h) => (
              <li key={h.id}>
                {new Date(h.createdAt).toLocaleString()} — {h.estadoAnterior ?? "—"} →{" "}
                {h.estadoNuevo} ({h.actor})
                {h.nota ? `: ${h.nota}` : ""}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
