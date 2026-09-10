"use client";

import React from "react";

export const PasosSection: React.FC = () => {
  const pasos = [
    {
      numero: 1,
      titulo: "Descarga y llena el formulario",
      descripcion: (
        <>
          Imprime el <strong className="text-slate-900 font-semibold">Formulario DT-AJ-001</strong>. Marca la casilla
          correspondiente (24, 25 o 26) y fírmalo.
        </>
      ),
    },
    {
      numero: 2,
      titulo: "Junta tus 3 documentos",
      descripcion: (
        <>
          Solo necesitas: <strong className="text-slate-900 font-semibold">1)</strong> Formulario firmado,{" "}
          <strong className="text-slate-900 font-semibold">2)</strong> Fotocopia de DPI de ambos lados,{" "}
          <strong className="text-slate-900 font-semibold">3)</strong> Comprobante oficial de fechas (médico, migratorio
          o penal).
        </>
      ),
    },
    {
      numero: 3,
      titulo: "Entrégalos en ventanilla",
      descripcion: (
        <>
          Preséntalos en la Sección de Asuntos Jurídicos del Tránsito PNC. Te entregarán tu contraseña de seguimiento.{" "}
          <strong className="text-slate-900 font-semibold">Resolución en 20 días hábiles.</strong>
        </>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold-800 tracking-wider uppercase mb-2 block">
            PROCEDIMIENTO DIRECTO
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-3">
            Cómo tramitar tu exoneración en 3 pasos
          </h3>
          <p className="text-sm sm:text-base text-slate-600">
            Un trámite administrativo directo, presencial y sin cobro alguno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pasos.map((p) => (
            <div
              key={p.numero}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow relative flex flex-col"
            >
              {/* Number Badge */}
              <div className="font-display w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-base mb-5 shadow-xs">
                {p.numero}
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                {p.titulo}
              </h4>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
