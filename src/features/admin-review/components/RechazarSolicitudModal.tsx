"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, FormTextarea, Modal } from "@/components/ui";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";
import { SolicitudResumen } from "./SolicitudResumen";

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

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={solicitud ? `Expediente ${solicitud.numeroExpediente}` : "Solicitud"}
      className="max-w-lg"
    >
      {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {solicitud && (
        <div className="flex flex-col gap-4">
          <SolicitudResumen solicitud={solicitud} />

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
