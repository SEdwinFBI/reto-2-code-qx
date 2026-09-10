"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Map as MapIcon, List, Clock, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  zona: string;
  departamento: string;
  horario: string;
  telefono: string;
  estado: string;
  distancia?: string;
  coordenadas?: string;
}

export const SedesSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<"lista" | "mapa">("lista");
  const [isLocating, setIsLocating] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);

  const sedes: Sede[] = [
    {
      id: "central",
      nombre: "Sede Central Tránsito PNC - Sección Asuntos Jurídicos",
      direccion: "Calzada Aguilar Batres 34-70, Zona 11",
      zona: "Zona 11",
      departamento: "Guatemala",
      horario: "Lunes a Viernes de 08:00 a 16:30 hrs",
      telefono: "PBX: 2320-4500 / Ext. 120",
      estado: "Abierto hoy",
      distancia: gpsActive ? "3.2 km" : undefined,
      coordenadas: "14.5885,-90.5512",
    },
    {
      id: "xela",
      nombre: "Delegación Departamental Quetzaltenango",
      direccion: "Diagonal 11 12-44, Zona 1, Edificio Gobernación",
      zona: "Zona 1",
      departamento: "Quetzaltenango",
      horario: "Lunes a Viernes de 08:00 a 16:00 hrs",
      telefono: "Tel: 7761-4209",
      estado: "Abierto hoy",
      distancia: gpsActive ? "198 km" : undefined,
      coordenadas: "14.8347,-91.5181",
    },
    {
      id: "escuintla",
      nombre: "Delegación Departamental Escuintla",
      direccion: "4ta. Avenida 3-21, Zona 1, Antigua Estación",
      zona: "Zona 1",
      departamento: "Escuintla",
      horario: "Lunes a Viernes de 08:00 a 16:00 hrs",
      telefono: "Tel: 7889-1120",
      estado: "Abierto hoy",
      distancia: gpsActive ? "58 km" : undefined,
      coordenadas: "14.3011,-90.7850",
    },
  ];

  const handleUpdateGps = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setGpsActive(true);
    }, 600);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gold-800 tracking-wider uppercase mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>VENTANILLAS DISPONIBLES DE ASUNTOS JURÍDICOS</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              Sedes Oficiales más Cercanas a tu Ubicación
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdateGps}
              disabled={isLocating}
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold gap-1.5"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
              <span>{gpsActive ? "GPS Actualizado" : "Actualizar GPS"}</span>
            </Button>

            <div className="inline-flex rounded-xl bg-slate-200/80 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("mapa")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === "mapa"
                    ? "bg-white text-brand-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Mapa</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("lista")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === "lista"
                    ? "bg-white text-brand-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === "lista" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sedes.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="blue" className="text-[11px] font-semibold">
                      {s.departamento}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {s.estado}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-navy-900 mb-2 leading-snug">
                    {s.nombre}
                  </h4>

                  <div className="flex items-start gap-2 text-xs text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{s.direccion}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.horario}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.telefono}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {s.distancia ? (
                    <span className="font-semibold text-brand-600">A {s.distancia} de ti</span>
                  ) : (
                    <span className="text-slate-400">Distancia no calculada</span>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${s.direccion}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                  >
                    Cómo llegar <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
              {/* Styled interactive map preview */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              <div className="relative z-10 text-center max-w-md p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-bounce" />
                <h5 className="text-sm font-bold text-slate-900 mb-1">
                  Sede Central: Aguilar Batres Zona 11
                </h5>
                <p className="text-xs text-slate-600 mb-3">
                  Atención en ventanilla de Asuntos Jurídicos de 08:00 a 16:30 hrs.
                </p>
                <a
                  href="https://maps.google.com/?q=Calzada+Aguilar+Batres+34-70+Zona+11+Guatemala"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
                >
                  Abrir en Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
