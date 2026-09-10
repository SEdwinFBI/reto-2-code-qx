"use client";

import React from "react";
import { PlusCircle, Plane, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CausalesSection: React.FC = () => {
  const causales = [
    {
      casilla: "Casilla 25",
      badgeVariant: "green" as const,
      icon: PlusCircle,
      iconColor: "text-emerald-600 bg-emerald-50",
      title: "Enfermedad o Accidente",
      description:
        "Haber sufrido hospitalización, reposo prescrito o impedimento físico que impidió presentarse a renovar.",
      requisito:
        "Certificación médica original del IGSS, red pública o médico colegiado activo.",
      gae: "3112",
    },
    {
      casilla: "Casilla 24",
      badgeVariant: "blue" as const,
      icon: Plane,
      iconColor: "text-blue-600 bg-blue-50",
      title: "Estar Fuera del País",
      description:
        "Haberse encontrado fuera del territorio guatemalteco al momento exacto en que caducó la vigencia de la licencia.",
      requisito:
        "Certificación de Movimiento Migratorio (IGM) o pasaporte con sellos legibles.",
      gae: "3111",
    },
    {
      casilla: "Casilla 26",
      badgeVariant: "purple" as const,
      icon: Lock,
      iconColor: "text-purple-600 bg-purple-50",
      title: "Privado de Libertad",
      description:
        "Haber permanecido en prisión preventiva o en cumplimiento de condena penal durante el vencimiento.",
      requisito:
        "Certificación de la Dirección General del Sistema Penitenciario o Juzgado ejecutor.",
      gae: "3113",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/60 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold-800 tracking-wider uppercase mb-2 block">
            BASE LEGAL 59-2012
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-3">
            Las 3 Causales Aprobadas por Ley
          </h3>
          <p className="text-sm sm:text-base text-slate-600">
            Si tu caso encaja en alguna de estas 3 situaciones, tienes derecho legal a solicitar el descargo del 100%.
          </p>
        </div>

        {/* 3 Causales Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {causales.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.casilla}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Casilla Badge + Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={c.badgeVariant} className="px-2.5 py-1 text-xs font-semibold">
                      {c.casilla}
                    </Badge>
                    <div className={`p-2 rounded-xl ${c.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {c.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {c.description}
                  </p>
                </div>

                <div>
                  {/* Inner Highlight Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                    <span className="block text-xs font-bold text-slate-900 mb-1">
                      Requisito clave:
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      {c.requisito}
                    </p>
                  </div>

                  {/* Footer GAE Code */}
                  <div className="text-[11px] font-mono text-slate-400">
                    Código GAE: {c.gae}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
