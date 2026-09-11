"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Card, FormTextarea } from "@/components/ui";
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
    } else {
      toast.error("No se pudo ejecutar la acción.");
    }
  }

  const causalInfo = CAUSALES[solicitud.causal];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{solicitud.numeroExpediente}</h1>
        <EstadoBadge estado={solicitud.estado} />
      </div>

      <Card className="flex flex-col gap-2 p-4">
        <h2 className="font-medium">Titular</h2>
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
      </Card>

      {solicitud.esGestionadoPorTercero && (
        <Card className="flex flex-col gap-2 p-4">
          <h2 className="font-medium">Gestor / tercero</h2>
          <p>
            {solicitud.gestorNombreCompleto} — CUI {solicitud.gestorCui}
          </p>
          <p>Relación con el titular: {solicitud.gestorRelacion}</p>
          <p>Teléfono: {solicitud.gestorTelefono}</p>
          <p>Correo: {solicitud.gestorCorreo}</p>
        </Card>
      )}

      {solicitud.esEmpleadoGobierno && (
        <Card className="flex flex-col gap-2 p-4">
          <h2 className="font-medium">Empleado de gobierno</h2>
          <p>Puesto: {solicitud.empleadoPuesto}</p>
          <p>Institución: {solicitud.empleadoInstitucion}</p>
        </Card>
      )}

      <Card className="flex flex-col gap-2 p-4">
        <h2 className="font-medium">Documentos</h2>
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
      </Card>

      {(solicitud.estado === "PENDIENTE" || solicitud.estado === "EN_REVISION") && (
        <Card className="flex flex-col gap-3 p-4">
          <h2 className="font-medium">Acciones de revisión</h2>
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
            <label className="text-sm font-medium" htmlFor="archivoResolucion">
              Documento de resolución/exoneración (obligatorio solo si aprueba)
            </label>
            <input
              id="archivoResolucion"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setArchivoResolucion(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {solicitud.estado === "PENDIENTE" && (
              <Button
                variant="secondary"
                disabled={isSubmittingAccion}
                onClick={() => handleAccion("iniciar_revision")}
              >
                Marcar en revisión
              </Button>
            )}
            <Button disabled={isSubmittingAccion} onClick={() => handleAccion("aprobar")}>
              Aprobar
            </Button>
            <Button
              variant="destructive"
              disabled={isSubmittingAccion}
              onClick={() => handleAccion("rechazar")}
            >
              Rechazar
            </Button>
          </div>
        </Card>
      )}

      {solicitud.motivoRechazo && (
        <Card className="flex flex-col gap-2 p-4">
          <h2 className="font-medium">Motivo de rechazo</h2>
          <p>{solicitud.motivoRechazo}</p>
        </Card>
      )}

      <Card className="flex flex-col gap-2 p-4">
        <h2 className="font-medium">Historial</h2>
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {solicitud.historial.map((h) => (
            <li key={h.id}>
              {new Date(h.createdAt).toLocaleString()} — {h.estadoAnterior ?? "—"} → {h.estadoNuevo} ({h.actor})
              {h.nota ? `: ${h.nota}` : ""}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
