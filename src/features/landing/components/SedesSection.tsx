"use client";

import React from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSedesLocation } from "../hooks/useSedesLocation";

export const SedesSection: React.FC = () => {
  const { isLocating, locationError, gpsActive, handleUpdateGps, mapUrl, searchUrl } = useSedesLocation();

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gold-800 tracking-wider uppercase mb-2">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>DEPARTAMENTO DE TRÁNSITO PNC</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              Encuentra una sede cerca de ti
            </h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUpdateGps}
            disabled={isLocating}
            className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold gap-1.5"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} aria-hidden="true" />
            <span>{isLocating ? "Obteniendo ubicación…" : gpsActive ? "Actualizar mi ubicación" : "Usar mi ubicación"}</span>
          </Button>

        </div>

        <p role="status" className="mb-4 text-sm text-slate-600">
          {locationError || (isLocating
            ? "Autoriza el acceso a tu ubicación en el navegador para buscar oficinas cerca de ti."
            : gpsActive
              ? "Búsqueda de oficinas del Departamento de Tránsito PNC cerca de tu ubicación."
              : "Permite el acceso a tu ubicación para buscar oficinas cercanas en Google Maps.")}
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="h-96 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-[480px]">
            <iframe
              title="Buscar oficinas del Departamento de Tránsito PNC en Google Maps"
              src={mapUrl}
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-xs text-slate-600">
              Para la exoneración, consulta la atención de Asuntos Jurídicos antes de acudir a una oficina.{" "}
              <a
                href="https://transito.gob.gt/requisitos-para-tramites/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-600 hover:underline"
              >
                Información oficial
              </a>
            </p>
            <a
              href={searchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Abrir en Google Maps <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
