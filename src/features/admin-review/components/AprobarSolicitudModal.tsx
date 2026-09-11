"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";
import { SolicitudResumen } from "./SolicitudResumen";

interface AprobarSolicitudModalProps {
  solicitudId: string;
  onClose: () => void;
  onAprobada: () => void;
}

export function AprobarSolicitudModal({
  solicitudId,
  onClose,
  onAprobada,
}: AprobarSolicitudModalProps) {
  const { solicitud, isLoading, error, ejecutarAccion, isSubmittingAccion } =
    useSolicitudDetail(solicitudId);
  const [archivoResolucion, setArchivoResolucion] = useState<File | null>(null);

  async function handleAprobar() {
    if (!archivoResolucion) {
      toast.error("Debe adjuntar el documento de resolución/exoneración.");
      return;
    }
    const ok = await ejecutarAccion("aprobar", { archivoResolucion });
    if (ok) {
      toast.success("Solicitud aprobada. Se notificó al solicitante.");
      onAprobada();
      onClose();
    } else {
      toast.error("No se pudo aprobar la solicitud.");
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

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <label className="text-sm font-medium text-navy-900" htmlFor="archivoResolucion">
              Documento de resolución/exoneración
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Imagen (JPG/PNG) o PDF escaneado, máximo 5 MB.
            </p>
            <input
              id="archivoResolucion"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setArchivoResolucion(e.target.files?.[0] ?? null)}
              className="mt-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={isSubmittingAccion}>
              Cancelar
            </Button>
            <Button onClick={handleAprobar} disabled={isSubmittingAccion}>
              {isSubmittingAccion ? "Aprobando…" : "Aprobar"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
