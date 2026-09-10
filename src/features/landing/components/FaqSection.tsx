"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: "¿Puedo pagar primero la multa en MAYCOM y pedir reembolso después?",
      answer: (
        <p>
          <strong className="text-red-700 font-semibold">No.</strong> Bajo el marco legal
          vigente del Departamento de Tránsito PNC, una vez pagada la multa en las agencias de
          emisión de licencias (MAYCOM) o entidades bancarias, el pago se considera legalmente
          consentido y definitivo. No existe procedimiento de reembolso o devolución retroactiva.
          Por tanto, si tu caso clasifica por fuerza mayor, debes tramitar y obtener tu resolución
          favorable de exoneración <strong>antes</strong> de efectuar cualquier pago.
        </p>
      ),
    },
    {
      question: "¿Qué hago si mi licencia tiene menos de 30 días de vencida?",
      answer: (
        <p>
          Si tu licencia de conducir tiene menos de 30 días calendario de vencimiento,
          debes acudir directamente a cualquier centro de emisión de licencias MAYCOM para tramitar
          tu renovación ordinaria. Las sanciones administrativas por extemporaneidad aplican al superar
          los plazos reglamentarios. Si tu vencimiento se produjo durante un impedimento de fuerza
          mayor (médico, migratorio o judicial), puedes solicitar la exoneración en cualquier momento
          presentando las pruebas correspondientes.
        </p>
      ),
    },
    {
      question: "¿Puede un familiar llevar mis papeles si no puedo viajar a la capital?",
      answer: (
        <p>
          <strong>Sí.</strong> Un familiar o tercero debidamente autorizado puede radicar el
          expediente en la Sección de Asuntos Jurídicos de Tránsito PNC. Para ello debe presentar:
          <br />
          1) Carta poder o autorización legalizada ante notario activo.
          <br />
          2) Fotocopia legible del DPI del titular de la licencia y del mandatario/familiar.
          <br />
          3) El Formulario DT-AJ-001 debidamente firmado y los 3 requisitos de prueba de la causal.
        </p>
      ),
    },
    {
      question: "¿Cuánto tiempo tiene la Sección de Asuntos Jurídicos para emitir resolución?",
      answer: (
        <p>
          De conformidad con el procedimiento administrativo y el Acuerdo Gubernativo 59-2012,
          la Sección de Asuntos Jurídicos tiene un plazo legal de{" "}
          <strong className="text-brand-600 font-semibold">20 días hábiles</strong> a partir de
          la entrega del expediente completo con su contraseña de recepción.
        </p>
      ),
    },
    {
      question: "¿Tiene algún costo este trámite de exoneración?",
      answer: (
        <p>
          <strong>Absolutamente ninguno.</strong> El trámite de solicitud de descargo y
          exoneración de multa por fuerza mayor ante el Departamento de Tránsito de la Policía
          Nacional Civil es <strong className="text-emerald-700 font-semibold">100% gratuito</strong>.
          Ningún funcionario o particular está autorizado a cobrar por este servicio.
        </p>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            Preguntas frecuentes
          </h3>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              defaultValue={index === 0 ? ["faq"] : undefined}
              className="rounded-2xl border border-slate-200/80 bg-white px-5 shadow-sm transition-all hover:border-slate-300"
            >
              <AccordionItem value="faq" className="border-none">
                <AccordionTrigger className="py-5 text-base font-semibold text-slate-800 hover:text-brand-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};
