"use client";

import React from "react";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

interface HeroSectionProps {
  onOpenSolicitud: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSolicitud }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-b from-blue-50/40 via-white to-white">
      <BackgroundRippleEffect rows={10} cols={34} cellSize={48} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-200/80 mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-800" />
          <span className="text-xs font-semibold text-gold-800 tracking-wide">
            Acuerdo Gubernativo 59-2012
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="font-display text-3xl sm:text-5xl lg:text-5xl font-bold text-navy-900 tracking-tight leading-[1.15] mb-6">
          ¿Tu licencia venció por fuerza mayor? <br />
          <span className="text-brand-600">No pagues la multa: exonérala al 100%.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Averigua en <strong className="font-semibold text-slate-900">4 preguntas rápidas</strong> si tu caso
          califica por ley, la casilla exacta a marcar en el{" "}
          <strong className="font-semibold text-slate-900">Formulario DT-AJ-001</strong> y los únicos 3 documentos
          que necesitas llevar a ventanilla.
        </p>

        {/* 3 Stat Cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs text-center transition-transform hover:-translate-y-0.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
              Q0.00
            </div>
            <div className="text-xs font-medium text-slate-500">Costo del trámite</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs text-center transition-transform hover:-translate-y-0.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
              Hasta Q300
            </div>
            <div className="text-xs font-medium text-slate-500">Ahorro en multa</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs text-center transition-transform hover:-translate-y-0.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
              20 Días
            </div>
            <div className="text-xs font-medium text-slate-500">Plazo legal resolución</div>
          </div>
        </div>

        {/* Digital Application Callout Card */}
        <div className="max-w-2xl mx-auto bg-white border border-brand-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left hover:border-brand-500/60 transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-navy-900">
                  Llenar Solicitud en Línea
                </span>
                <Badge variant="green" className="text-[10px] py-0 px-2 font-bold">
                  Nuevo
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingresa tu CUI, datos personales y adjunta tus 3 requisitos digitales.
              </p>
            </div>
          </div>

          <Button
            onClick={onOpenSolicitud}
            className="w-full sm:w-auto shrink-0 font-semibold gap-2 shadow-xs"
          >
            <span>Iniciar Trámite</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
