"use client";

import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";
import { SolicitudResumen } from "./SolicitudResumen";

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
