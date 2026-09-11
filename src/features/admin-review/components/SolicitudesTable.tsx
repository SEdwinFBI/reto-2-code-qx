"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { CAUSALES } from "@/lib/causales";
import { useSolicitudesList } from "../hooks/useSolicitudesList";
import { AprobarSolicitudModal } from "./AprobarSolicitudModal";
import { EstadoBadge } from "./EstadoBadge";
import { IniciarRevisionModal } from "./IniciarRevisionModal";
import { RechazarSolicitudModal } from "./RechazarSolicitudModal";
import { SolicitudesFilters } from "./SolicitudesFilters";
import { SolicitudesPagination } from "./SolicitudesPagination";
import { SolicitudesStats } from "./SolicitudesStats";

const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function SolicitudesTable() {
  const {
    solicitudes,
    estado,
    setEstado,
    search,
    setSearch,
    page,
    pageSize,
    total,
    setPage,
    countsByEstado,
    isLoading,
    error,
    reload,
  } = useSolicitudesList();

  const [revisionSolicitudId, setRevisionSolicitudId] = useState<string | null>(null);
  const [aprobarSolicitudId, setAprobarSolicitudId] = useState<string | null>(null);
  const [rechazarSolicitudId, setRechazarSolicitudId] = useState<string | null>(null);

  const totalGeneral = Object.values(countsByEstado).reduce((sum, n) => sum + (n ?? 0), 0);

  return (
    <div className="flex flex-col gap-4">
      <SolicitudesStats countsByEstado={countsByEstado} />

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold tracking-tight text-navy-900">
              Solicitudes
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {totalGeneral} expediente{totalGeneral === 1 ? "" : "s"} registrado
              {totalGeneral === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <SolicitudesFilters
            estado={estado}
            onEstadoChange={setEstado}
            countsByEstado={countsByEstado}
            totalGeneral={totalGeneral}
            search={search}
            onSearchChange={setSearch}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : solicitudes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay solicitudes en este estado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-xs uppercase">Expediente</TableHead>
                    <TableHead className="text-xs uppercase">Solicitante</TableHead>
                    <TableHead className="text-xs uppercase">Causal</TableHead>
                    <TableHead className="text-xs uppercase">Gestión</TableHead>
                    <TableHead className="text-xs uppercase">Fecha</TableHead>
                    <TableHead className="text-xs uppercase">Estado</TableHead>
                    <TableHead className="text-xs uppercase">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudes.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/70">
                      <TableCell>
                        <Link
                          href={`/admin/solicitudes/${s.id}`}
                          className="font-mono font-semibold text-navy-900 underline-offset-2 hover:underline"
                        >
                          {s.numeroExpediente}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {s.nombres} {s.apellidos}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{CAUSALES[s.causal].titulo}</Badge>
                      </TableCell>
                      <TableCell className="flex flex-wrap gap-1">
                        {s.esGestionadoPorTercero && (
                          <Badge variant="outline">
                            Gestionado por: {s.gestorNombreCompleto} ({s.gestorRelacion})
                          </Badge>
                        )}
                        {s.esEmpleadoGobierno && (
                          <Badge variant="outline">Empleado de gobierno</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dateFormatter.format(new Date(s.createdAt))}
                      </TableCell>
                      <TableCell>
                        <EstadoBadge estado={s.estado} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {s.estado === "PENDIENTE" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setRevisionSolicitudId(s.id)}
                            >
                              Iniciar revisión
                            </Button>
                          )}
                          {s.estado === "EN_REVISION" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                nativeButton={false}
                                render={<Link href={`/admin/solicitudes/${s.id}`} />}
                              >
                                Ver detalle
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setAprobarSolicitudId(s.id)}
                              >
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setRechazarSolicitudId(s.id)}
                              >
                                Rechazar
                              </Button>
                            </>
                          )}
                          {(s.estado === "APROBADA" || s.estado === "RECHAZADA") && (
                            <Button
                              size="sm"
                              variant="outline"
                              nativeButton={false}
                              render={<Link href={`/admin/solicitudes/${s.id}`} />}
                            >
                              Ver detalle
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && solicitudes.length > 0 && (
            <SolicitudesPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {revisionSolicitudId && (
        <IniciarRevisionModal
          solicitudId={revisionSolicitudId}
          onClose={() => setRevisionSolicitudId(null)}
          onRevisionIniciada={reload}
        />
      )}

      {aprobarSolicitudId && (
        <AprobarSolicitudModal
          solicitudId={aprobarSolicitudId}
          onClose={() => setAprobarSolicitudId(null)}
          onAprobada={reload}
        />
      )}

      {rechazarSolicitudId && (
        <RechazarSolicitudModal
          solicitudId={rechazarSolicitudId}
          onClose={() => setRechazarSolicitudId(null)}
          onRechazada={reload}
        />
      )}
    </div>
  );
}
