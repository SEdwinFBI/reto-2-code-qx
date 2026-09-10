"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  CheckCircle2,
  Shield,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { SolicitudFormData, SolicitudResult, CausalTipo } from "../types";

interface SolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  formData: SolicitudFormData;
  updateField: (field: keyof SolicitudFormData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  result: SolicitudResult | null;
}

export const SolicitudModal: React.FC<SolicitudModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  formData,
  updateField,
  nextStep,
  prevStep,
  onSubmit,
  isSubmitting,
  result,
}) => {
  const [fileSimulations, setFileSimulations] = useState({
    formulario: false,
    dpi: false,
    comprobante: false,
  });

  const causalesList: {
    id: CausalTipo;
    casilla: string;
    titulo: string;
    descripcion: string;
    requisito: string;
    gae: string;
  }[] = [
    {
      id: "25",
      casilla: "Casilla 25",
      titulo: "Enfermedad o Accidente",
      descripcion: "Hospitalización, reposo prescrito o impedimento físico.",
      requisito: "Certificación médica original del IGSS, red pública o colegiado activo.",
      gae: "3112",
    },
    {
      id: "24",
      casilla: "Casilla 24",
      titulo: "Estar Fuera del País",
      descripcion: "Haberse encontrado fuera de Guatemala al momento en que caducó la licencia.",
      requisito: "Certificación de Movimiento Migratorio (IGM) o pasaporte con sellos.",
      gae: "3111",
    },
    {
      id: "26",
      casilla: "Casilla 26",
      titulo: "Privado de Libertad",
      descripcion: "Prisión preventiva o cumplimiento de condena penal.",
      requisito: "Certificación de la Dirección General del Sistema Penitenciario.",
      gae: "3113",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitud de Exoneración de Multa de Tránsito"
      className="sm:max-w-2xl"
    >
      {/* Progress Bar */}
      {currentStep <= 3 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={currentStep >= 1 ? "text-blue-600 font-bold" : ""}>
              1. Datos del Solicitante
            </span>
            <span className={currentStep >= 2 ? "text-blue-600 font-bold" : ""}>
              2. Causal Legal
            </span>
            <span className={currentStep >= 3 ? "text-blue-600 font-bold" : ""}>
              3. Documentos
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Datos Personales */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              Ingresa tus datos conforme a tu Documento Personal de Identificación (DPI).
              Este trámite es gratuito según Acuerdo Gubernativo 59-2012.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="CUI / DPI (13 dígitos)"
              placeholder="Ej: 2450 12345 0101"
              value={formData.cui}
              onChange={(e) => updateField("cui", e.target.value)}
              required
            />
            <FormInput
              label="Teléfono de Contacto"
              placeholder="Ej: 5555 4433"
              value={formData.telefono}
              onChange={(e) => updateField("telefono", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nombres Completos"
              placeholder="Tus nombres"
              value={formData.nombres}
              onChange={(e) => updateField("nombres", e.target.value)}
              required
            />
            <FormInput
              label="Apellidos Completos"
              placeholder="Tus apellidos"
              value={formData.apellidos}
              onChange={(e) => updateField("apellidos", e.target.value)}
              required
            />
          </div>

          <FormInput
            label="Correo Electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            value={formData.correo}
            onChange={(e) => updateField("correo", e.target.value)}
            helperText="Aquí recibirás la notificación de resolución oficial."
          />

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={nextStep}
              disabled={!formData.cui || !formData.nombres}
              className="gap-2"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Causal Legal */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Selecciona la causal por la cual no pudiste renovar tu licencia dentro de la fecha legal:
          </p>

          <div className="space-y-3">
            {causalesList.map((c) => {
              const isSelected = formData.causal === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => updateField("causal", c.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">{c.titulo}</span>
                    <Badge variant={c.id === "25" ? "green" : c.id === "24" ? "blue" : "purple"}>
                      {c.casilla}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{c.descripcion}</p>
                  <p className="text-[11px] text-blue-800 font-medium">
                    Requisito: {c.requisito}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <FormInput
              label="Fecha en que venció tu licencia"
              type="date"
              value={formData.fechaVencimiento}
              onChange={(e) => updateField("fechaVencimiento", e.target.value)}
            />
            <FormInput
              label="Fecha del impedimento o retorno"
              type="date"
              value={formData.fechaHecho}
              onChange={(e) => updateField("fechaHecho", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" type="button" onClick={prevStep} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Regresar
            </Button>
            <Button type="button" onClick={nextStep} className="gap-2">
              Continuar a Requisitos <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Requisitos Digitales */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Adjunta tus 3 requisitos digitales en formato PDF o imagen legible:
          </p>

          <div className="space-y-3">
            {/* Requisito 1 */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    1. Formulario DT-AJ-001 firmado
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Marca la Casilla {formData.causal} y firma idéntica al DPI.
                  </p>
                </div>
              </div>
              <Button
                variant={fileSimulations.formulario ? "secondary" : "outline"}
                size="sm"
                type="button"
                onClick={() =>
                  setFileSimulations((p) => ({ ...p, formulario: !p.formulario }))
                }
              >
                {fileSimulations.formulario ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Adjunto
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Subir
                  </span>
                )}
              </Button>
            </div>

            {/* Requisito 2 */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    2. Fotocopia de DPI de ambos lados
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Vigente y completamente legible.
                  </p>
                </div>
              </div>
              <Button
                variant={fileSimulations.dpi ? "secondary" : "outline"}
                size="sm"
                type="button"
                onClick={() => setFileSimulations((p) => ({ ...p, dpi: !p.dpi }))}
              >
                {fileSimulations.dpi ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Adjunto
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Subir
                  </span>
                )}
              </Button>
            </div>

            {/* Requisito 3 */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    3. Comprobante oficial de fechas
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {formData.causal === "25" && "Certificado médico del IGSS o médico colegiado."}
                    {formData.causal === "24" && "Movimiento migratorio oficial o pasaporte sellado."}
                    {formData.causal === "26" && "Constancia del Sistema Penitenciario o juzgado."}
                  </p>
                </div>
              </div>
              <Button
                variant={fileSimulations.comprobante ? "secondary" : "outline"}
                size="sm"
                type="button"
                onClick={() =>
                  setFileSimulations((p) => ({ ...p, comprobante: !p.comprobante }))
                }
              >
                {fileSimulations.comprobante ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Adjunto
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Subir
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" type="button" onClick={prevStep} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Regresar
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? "Radicando Expediente..." : "Radicar Solicitud Oficial"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Solicitud Radicada con Éxito */}
      {currentStep === 4 && result && (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900">
              ¡Solicitud Radicada Exitosamente!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Tu expediente ha sido recibido por la Sección de Asuntos Jurídicos - Tránsito PNC
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200/70 pb-2">
              <span className="text-slate-500">No. Expediente:</span>
              <span className="font-mono font-bold text-blue-700 text-sm">
                {result.numeroExpediente}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/70 pb-2">
              <span className="text-slate-500">Fecha de radicación:</span>
              <span className="font-semibold text-slate-800">{result.fechaRadicacion}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/70 pb-2">
              <span className="text-slate-500">Causal registrada:</span>
              <span className="font-semibold text-slate-800">{result.causalNombre}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Plazo legal de resolución:</span>
              <span className="font-bold text-emerald-700">
                {result.plazoDiasHabiles} días hábiles
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={onClose} className="w-full">
              Finalizar y Descargar Contraseña
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
