"use client";

import React from "react";
import { PlusCircle, Plane, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PinContainer } from "@/components/ui/3d-pin";

export const CausalesSection: React.FC = () => {
  const causales = [
    {
      casilla: "Casilla 25",
      badgeVariant: "green" as const,
      icon: PlusCircle,
      iconColor: "text-white-400 bg-emerald-500/10",
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
      iconColor: "text-brand-400 bg-brand-500/10",
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
      iconColor: "text-purple-400 bg-purple-500/10",
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

        {/* 3 Causales Cards — each an interactive 3D "pin" linking to its official trámite */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {causales.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.casilla} className="flex h-[23rem] items-center justify-center">
                <PinContainer
                  title={`tramites.gob.gt · GAE ${c.gae}`}
                  href={`https://tramites.gob.gt/servicio/${c.gae}/`}
                  containerClassName="w-full"
                >
                  <div className="flex w-[19rem] flex-col justify-between p-1 sm:w-[20rem]">
                    <div>
                      {/* Top Row: Casilla Badge + Icon */}
                      <div className="mb-4 flex items-center justify-between">
                        <Badge variant={c.badgeVariant} className="px-2.5 py-1 text-xs font-semibold">
                          {c.casilla}
                        </Badge>
                        <div className={`rounded-xl p-2 ${c.iconColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="mb-2 text-lg font-bold text-slate-100">{c.title}</h4>
                      <p className="mb-6 text-xs leading-relaxed text-white sm:text-sm">
                        {c.description}
                      </p>
                    </div>

                    <div>
                      {/* Inner Highlight Box */}
                      <div className="mb-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-3">
                        <span className="mb-1 block text-xs font-bold text-white">
                          Requisito clave:
                        </span>
                        <p className="text-xs leading-normal text-slate-300">{c.requisito}</p>
                      </div>

                      {/* Footer GAE Code */}
                      <div className="font-mono text-[11px] text-white">
                        Código GAE: {c.gae}
                      </div>
                    </div>
                  </div>
                </PinContainer>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
