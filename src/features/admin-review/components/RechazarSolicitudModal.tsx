"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, FormTextarea, Modal } from "@/components/ui";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";

interface RechazarSolicitudModalProps {
  solicitudId: string;
  onClose: () => void;
  onRechazada: () => void;
}

export function RechazarSolicitudModal({
  solicitudId,
  onClose,
  onRechazada,
}: RechazarSolicitudModalProps) {
  const { solicitud, isLoading, error, ejecutarAccion, isSubmittingAccion } =
    useSolicitudDetail(solicitudId);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  async function handleRechazar() {
    if (!motivoRechazo.trim()) {
      toast.error("Debe indicar el motivo de rechazo.");
      return;
    }
    const ok = await ejecutarAccion("rechazar", { motivoRechazo });
    if (ok) {
      toast.success("Solicitud rechazada. Se notificó al solicitante.");
      onRechazada();
      onClose();
    } else {
      toast.error("No se pudo rechazar la solicitud.");
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
          </div>

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

          <FormTextarea
            label="Motivo de rechazo"
            required
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            placeholder="Explique por qué se rechaza la solicitud…"
          />

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={isSubmittingAccion}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRechazar} disabled={isSubmittingAccion}>
              {isSubmittingAccion ? "Rechazando…" : "Rechazar"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
