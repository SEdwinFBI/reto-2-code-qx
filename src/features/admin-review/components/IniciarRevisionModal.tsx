"use client";

import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";

interface IniciarRevisionModalProps {
  solicitudId: string;
  onClose: () => void;
  onRevisionIniciada: () => void;
}

export function IniciarRevisionModal({
  solicitudId,
  onClose,
  onRevisionIniciada,
}: IniciarRevisionModalProps) {
  const { solicitud, isLoading, error, ejecutarAccion, isSubmittingAccion } =
    useSolicitudDetail(solicitudId);

  async function handleIniciarRevision() {
    const ok = await ejecutarAccion("iniciar_revision");
    if (ok) {
      toast.success("Solicitud marcada en revisión.");
      onRevisionIniciada();
      onClose();
    } else {
      toast.error("No se pudo iniciar la revisión.");
    }
  }

  const causalInfo = solicitud ? CAUSALES[solicitud.causal] : null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={solicitud ? `Expediente ${solicitud.numeroExpediente}` : "Solicitud"}
      className="max-w-lg"
    >
      {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {solicitud && causalInfo && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3">
            <h3 className="text-sm font-semibold text-foreground">Titular</h3>
            <p className="text-sm text-muted-foreground">
              {solicitud.nombres} {solicitud.apellidos} — CUI {solicitud.cui}
            </p>
            <p className="text-sm text-muted-foreground">Teléfono: {solicitud.telefono}</p>
            <p className="text-sm text-muted-foreground">Correo: {solicitud.correo}</p>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3">
            <h3 className="text-sm font-semibold text-foreground">Causal invocada</h3>
            <p className="text-sm text-muted-foreground">
              {causalInfo.titulo} ({causalInfo.casilla}, GAE {causalInfo.gae})
            </p>
            <p className="text-sm text-muted-foreground">
              Requisito: {causalInfo.requisitoComprobante}
            </p>
            {solicitud.observaciones && (
              <p className="text-sm text-muted-foreground">
                Observaciones: {solicitud.observaciones}
              </p>
            )}
          </div>

          {solicitud.esGestionadoPorTercero && (
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3">
              <h3 className="text-sm font-semibold text-foreground">Gestor / tercero</h3>
              <p className="text-sm text-muted-foreground">
                {solicitud.gestorNombreCompleto} — CUI {solicitud.gestorCui} (
                {solicitud.gestorRelacion})
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/40 p-3">
            <h3 className="text-sm font-semibold text-foreground">Documentos adjuntos</h3>
            <a
              href={solicitud.dpiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              DPI — {solicitud.dpiOriginalName}
            </a>
            <a
              href={solicitud.comprobanteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              Comprobante — {solicitud.comprobanteOriginalName}
            </a>
            {solicitud.autorizacionUrl && (
              <a
                href={solicitud.autorizacionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-600 underline underline-offset-2 hover:text-brand-700"
              >
                Autorización / carta poder — {solicitud.autorizacionOriginalName}
              </a>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={isSubmittingAccion}>
              Cancelar
            </Button>
            <Button onClick={handleIniciarRevision} disabled={isSubmittingAccion}>
              {isSubmittingAccion ? "Iniciando…" : "Iniciar revisión"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
