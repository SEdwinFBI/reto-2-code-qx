"use client";

import { Button, Card, Badge } from "@/components/ui";
import { useTrackerStatus } from "../hooks/useTrackerStatus";
import { useTrackerDocumento } from "../hooks/useTrackerDocumento";

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente de revisión",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

export function TrackerView({ token }: { token: string }) {
  const { status, isLoading, error } = useTrackerStatus(token);
  const { documento, isLoading: isLoadingDocumento } = useTrackerDocumento(
    token,
    status?.estado === "APROBADA"
  );

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Consultando estado…</p>;
  }

  if (error || !status) {
    return (
      <Card className="p-6">
        <p className="text-sm text-destructive">
          {error ?? "No se encontró la solicitud."}
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3 p-6">
      <h1 className="text-lg font-semibold">Seguimiento de solicitud</h1>
      <p className="text-sm text-muted-foreground">Expediente: {status.numeroExpediente}</p>
      <p className="text-sm text-muted-foreground">Causal: {status.causalNombre}</p>
      <Badge variant="outline" className="w-fit">
        {ESTADO_LABELS[status.estado]}
      </Badge>
      {status.estado === "RECHAZADA" && status.motivoRechazo && (
        <p className="text-sm">Motivo de rechazo: {status.motivoRechazo}</p>
      )}
      {(status.estado === "PENDIENTE" || status.estado === "EN_REVISION") && (
        <p className="text-sm text-muted-foreground">
          Plazo estimado de resolución: {status.plazoDiasHabiles} días hábiles.
        </p>
      )}
      {status.estado === "APROBADA" && (
        <>
          {isLoadingDocumento && (
            <p className="text-sm text-muted-foreground">Preparando documento…</p>
          )}
          {!isLoadingDocumento && documento && (
            <Button
              className="w-fit"
              onClick={() => window.open(documento.url, "_blank", "noopener,noreferrer")}
            >
              Descargar documento de exoneración
            </Button>
          )}
          {!isLoadingDocumento && !documento && (
            <p className="text-sm text-muted-foreground">
              El documento aún no está disponible. Intente más tarde.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
