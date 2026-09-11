"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  FormSelect,
  Badge,
} from "@/components/ui";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudesList } from "../hooks/useSolicitudesList";
import { EstadoBadge } from "./EstadoBadge";
import type { EstadoSolicitud } from "../types";

const ESTADOS: (EstadoSolicitud | "TODAS")[] = [
  "TODAS",
  "PENDIENTE",
  "EN_REVISION",
  "APROBADA",
  "RECHAZADA",
];

const ESTADO_LABELS: Record<string, string> = {
  TODAS: "Todas",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
};

export function SolicitudesTable() {
  const { solicitudes, estado, setEstado, isLoading, error } = useSolicitudesList();

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-xs">
        <FormSelect
          label="Filtrar por estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoSolicitud | "TODAS")}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {ESTADO_LABELS[e]}
            </option>
          ))}
        </FormSelect>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : solicitudes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay solicitudes en este estado.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expediente</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Causal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Gestión</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Link href={`/admin/solicitudes/${s.id}`} className="font-medium underline-offset-2 hover:underline">
                    {s.numeroExpediente}
                  </Link>
                </TableCell>
                <TableCell>
                  {s.nombres} {s.apellidos}
                </TableCell>
                <TableCell>{CAUSALES[s.causal].titulo}</TableCell>
                <TableCell>
                  <EstadoBadge estado={s.estado} />
                </TableCell>
                <TableCell className="flex flex-wrap gap-1">
                  {s.esGestionadoPorTercero && (
                    <Badge variant="outline">
                      Gestionado por: {s.gestorNombreCompleto} ({s.gestorRelacion})
                    </Badge>
                  )}
                  {s.esEmpleadoGobierno && <Badge variant="outline">Empleado de gobierno</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
