"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Modal } from "@/components/ui";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudDetail } from "../hooks/useSolicitudDetail";

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

          <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3">
            <label className="text-sm font-semibold text-foreground" htmlFor="archivoResolucion">
              Documento de resolución/exoneración
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <p className="text-xs text-muted-foreground">
              Imagen (JPG/PNG) o PDF escaneado, máximo 5 MB.
            </p>
            <input
              id="archivoResolucion"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setArchivoResolucion(e.target.files?.[0] ?? null)}
              className="text-sm"
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
