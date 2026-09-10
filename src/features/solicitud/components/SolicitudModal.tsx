"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { SolicitudFormData, SolicitudResult, CausalTipo } from "../types";

interface SolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  formData: SolicitudFormData;
  updateField: <K extends keyof SolicitudFormData>(field: K, value: SolicitudFormData[K]) => void;
  onConsultarPersona: () => void;
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
  onConsultarPersona,
  nextStep,
  prevStep,
  onSubmit,
  isSubmitting,
  result,
}) => {
  const [fileSimulations, setFileSimulations] = useState({
    dpi: false,
    comprobante: null as CausalTipo | null,
  });

  const motivos = [
    {
      id: "24",
      titulo: "Estar fuera del país",
      descripcion: "Haberse encontrado fuera de Guatemala al momento en que caducó la licencia.",
      requisito: "Constancia de movimiento migratorio.",
      variant: "blue",
    },
    {
      id: "25",
      titulo: "Enfermedad",
      descripcion: "Hospitalización, reposo prescrito o impedimento físico.",
      requisito: "Constancia de consulta médica por colegiado activo.",
      variant: "green",
    },
    {
      id: "26",
      titulo: "Prisión",
      descripcion: "Prisión preventiva o cumplimiento de condena penal.",
      requisito: "Constancia de estadía en prisión.",
      variant: "purple",
    },
  ] as const;

  const stepTitles = ["Información personal", "Información de tercero", "Información adicional", "Número de trámite solicitado", "Documentos"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitud de Exoneración de Multa de Tránsito"
      className="sm:max-w-2xl"
    >
      {/* Progress Bar */}
      {currentStep <= 5 && (
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-4 text-center text-sm font-semibold text-slate-500 mb-3">
            {stepTitles.map((label, index) => (
              <span
                key={label}
                aria-label={`Paso ${index + 1}: ${label}`}
                aria-current={currentStep === index + 1 ? "step" : undefined}
                className={currentStep >= index + 1 ? "text-blue-600 font-bold" : ""}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
          <h3 className="mt-4 text-center text-base font-semibold" aria-live="polite">
            {stepTitles[currentStep - 1]}
          </h3>
        </div>
      )}

      {/* Step 1: Datos Personales */}
      {currentStep === 1 && (
        <div className="space-y-6">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            onConsultarPersona();
          }}
        >
          <fieldset className="space-y-4">
            <legend className="mb-2 text-sm font-semibold">Información personal</legend>
            <p className="text-sm text-muted-foreground">
              Completa los tres campos obligatorios y pulsa Consultar.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
              <FormInput
                label="CUI (13 dígitos)"
                inputMode="numeric"
                pattern="[0-9]{13}"
                maxLength={13}
                value={formData.cui}
                onChange={(e) => updateField("cui", e.target.value)}
                required
              />
          </div>
              <FormInput
                label="Fecha de nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => updateField("fechaNacimiento", e.target.value)}
                required
              />
              <FormInput
                label="Últimos 4 dígitos de serie"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={formData.serie}
                onChange={(e) => updateField("serie", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Consulta de demostración: se rellenarán datos ficticios.
              </p>
              <Button type="submit">Consultar</Button>
            </div>
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="mb-2 text-sm font-semibold">Datos consultados</legend>
            <p className="text-sm text-muted-foreground">
              Se completarán al consultar. Solo puedes editar el número de licencia.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
              <FormInput
                label="Nombre completo"
                value={[formData.nombres, formData.apellidos].filter(Boolean).join(" ")}
                readOnly
              />
              </div>
              <FormInput label="Nacionalidad" value={formData.nacionalidad} readOnly />
              <FormInput
                label="No. de licencia"
                value={formData.numeroLicencia}
                onChange={(e) => updateField("numeroLicencia", e.target.value)}
              />
              <FormInput
                label="País de emisión de licencia"
                value={formData.paisEmisionLicencia}
                readOnly
              />
            </div>
          </fieldset>
        </form>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (formData.nombres) nextStep();
          }}
        >
          <fieldset className="space-y-4">
            <legend className="mb-2 text-sm font-semibold">Licencias o documentos de licencia</legend>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4 text-blue-600" aria-hidden="true" />
              <span>Puedes incluir varios en esta solicitud.</span>
              <Badge variant="blue">
                {formData.numerosDocumento.length} {formData.numerosDocumento.length === 1 ? "documento" : "documentos"}
              </Badge>
            </div>
            {formData.numerosDocumento.map((numero, index) => (
              <div key={index} className="grid grid-cols-[minmax(0,1fr)_5rem] items-end gap-2">
                <div className="min-w-0">
                  <FormInput
                    id={`numero-documento-${index}`}
                    label={index === 0 ? "Número de documento" : `Número de documento ${index + 1}`}
                    type="text"
                    value={numero}
                    onChange={(event) => updateField(
                      "numerosDocumento",
                      formData.numerosDocumento.map((value, position) =>
                        position === index ? event.target.value : value
                      )
                    )}
                    required
                    pattern=".*\S.*"
                  />
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                    aria-label={`Eliminar documento ${index + 1}`}
                    onClick={() => updateField(
                      "numerosDocumento",
                      formData.numerosDocumento.filter((_, position) => position !== index)
                    )}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              aria-label="Agregar otro número de documento"
              onClick={() => updateField("numerosDocumento", [...formData.numerosDocumento, ""])}
            >
              <Plus className="size-5" aria-hidden="true" />
              Agregar otra licencia o documento
            </Button>
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="mb-2 text-sm font-semibold">Datos de contacto</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormInput
                  id="solicitante-correo"
                  label="Correo electrónico"
                  type="email"
                  value={formData.correo}
                  onChange={(event) => updateField("correo", event.target.value)}
                />
              </div>
              <FormInput
                id="solicitante-telefono"
                label="Número de teléfono"
                type="tel"
                value={formData.telefono}
                onChange={(event) => updateField("telefono", event.target.value)}
              />
              <FormInput
                id="solicitante-telefono-alternativo"
                label="Teléfono alternativo"
                type="tel"
                value={formData.telefonoAlternativo}
                onChange={(event) => updateField("telefonoAlternativo", event.target.value)}
              />
            </div>
          </fieldset>
          <div className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={!formData.nombres}>Continuar</Button>
          </div>
        </form>
        </div>
      )}

      {/* Step 2: Información de tercero */}
      {currentStep === 2 && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            nextStep();
          }}
        >
          <fieldset className="space-y-4">
            <legend className="mb-2 text-sm font-semibold">Información de tercero</legend>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.tramitaTercero}
                onChange={(event) => updateField("tramitaTercero", event.target.checked)}
                aria-controls="datos-tercero"
                aria-expanded={formData.tramitaTercero}
              />
              Un tercero está realizando el trámite
            </label>
            {formData.tramitaTercero && (
              <div id="datos-tercero" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Completa todos los datos de la persona que realiza el trámite.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    id="tercero-cui"
                    label="CUI (13 dígitos)"
                    inputMode="numeric"
                    pattern="[0-9]{13}"
                    maxLength={13}
                    value={formData.terceroCui}
                    onChange={(event) => updateField("terceroCui", event.target.value)}
                    required
                  />
                  <FormInput
                    id="tercero-nombre"
                    label="Nombre completo"
                    pattern=".*\S.*"
                    value={formData.terceroNombreCompleto}
                    onChange={(event) => updateField("terceroNombreCompleto", event.target.value)}
                    required
                  />
                  <FormInput
                    label="Parentesco"
                    pattern=".*\S.*"
                    value={formData.terceroParentesco}
                    onChange={(event) => updateField("terceroParentesco", event.target.value)}
                    required
                  />
                  <FormInput
                    label="Correo electrónico"
                    type="email"
                    value={formData.terceroCorreo}
                    onChange={(event) => updateField("terceroCorreo", event.target.value)}
                    required
                  />
                  <FormInput
                    label="No. de teléfono"
                    type="tel"
                    pattern=".*[0-9].*"
                    value={formData.terceroTelefono}
                    onChange={(event) => updateField("terceroTelefono", event.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </fieldset>

          <div className="flex items-center justify-between border-t pt-4">
          <Button variant="ghost" type="button" onClick={prevStep}>
            Regresar
          </Button>
          <Button
            type="submit"
          >
            Continuar
          </Button>
          </div>
        </form>
      )}

      {/* Step 3: Información adicional */}
      {currentStep === 3 && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            nextStep();
          }}
        >
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold">Información adicional</legend>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.esTrabajadorPublico}
                onChange={(event) => updateField("esTrabajadorPublico", event.target.checked)}
                aria-controls="datos-trabajador-publico"
                aria-expanded={formData.esTrabajadorPublico}
              />
              Es funcionario o empleado público
            </label>
            {formData.esTrabajadorPublico && (
              <div id="datos-trabajador-publico">
                <FormInput
                  id="institucion-puesto"
                  label="Institución y puesto que ocupa"
                  type="text"
                  pattern=".*\S.*"
                  required
                  value={formData.institucionYPuesto}
                  onChange={(event) => updateField("institucionYPuesto", event.target.value)}
                />
              </div>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.solicitaAbogado}
                onChange={(event) => updateField("solicitaAbogado", event.target.checked)}
                aria-controls="datos-abogado"
                aria-expanded={formData.solicitaAbogado}
              />
              La solicitud se realiza por parte de un abogado
            </label>
            {formData.solicitaAbogado && (
              <div id="datos-abogado">
                <FormInput
                  id="numero-colegiado-activo"
                  label="No. de colegiado activo"
                  type="text"
                  pattern=".*\S.*"
                  required
                  value={formData.numeroColegiadoActivo}
                  onChange={(event) => updateField("numeroColegiadoActivo", event.target.value)}
                />
              </div>
            )}
          </fieldset>
          <div className="flex items-center justify-between border-t pt-4">
            <Button variant="ghost" type="button" onClick={prevStep}>
              Regresar
            </Button>
            <Button type="submit">Continuar</Button>
          </div>
        </form>
      )}

      {/* Step 4: Número de trámite solicitado */}
      {currentStep === 4 && (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            nextStep();
          }}
        >
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-semibold">
              Motivo del trámite <span className="text-red-600" aria-hidden="true">*</span>
            </legend>
            {motivos.map((motivo) => (
              <label key={motivo.id} className="block cursor-pointer">
                <input
                  type="radio"
                  name="motivo-tramite"
                  value={motivo.id}
                  checked={formData.causal === motivo.id}
                  onChange={() => updateField("causal", motivo.id)}
                  className="peer sr-only"
                  required
                />
                <span className="block rounded-xl border-2 border-slate-200 bg-white p-4 transition-all hover:border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-50/50 peer-checked:shadow-xs peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600">
                  <span className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-900">{motivo.titulo}</span>
                    <Badge variant={motivo.variant}>Casilla {motivo.id}</Badge>
                  </span>
                  <span className="mb-2 block text-xs text-slate-600">{motivo.descripcion}</span>
                  <span className="block text-[11px] font-medium text-blue-800">
                    Requisito: {motivo.requisito}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="border-t pt-6">
            <FormTextarea
              label="Favor llenar un breve resumen de su solicitud"
              rows={4}
              required
              value={formData.observaciones}
              onChange={(event) => {
                event.target.setCustomValidity(
                  event.target.value.trim() ? "" : "Escribe un breve resumen de tu solicitud."
                );
                updateField("observaciones", event.target.value);
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" type="button" onClick={prevStep} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Regresar
            </Button>
            <Button type="submit" className="gap-2">
              Continuar a Requisitos <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 5: Requisitos Digitales */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Adjunta los 2 documentos requeridos en formato PDF o imagen legible:
          </p>

          <div className="space-y-3">
            {/* DPI requerido para todos los trámites */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    1. Fotocopia de DPI de ambos lados
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

            {/* Constancia correspondiente al trámite */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    2. {formData.causal === "26"
                      ? "Constancia de estadía en prisión"
                      : formData.causal === "25"
                        ? "Constancia de consulta médica por colegiado activo"
                        : "Constancia de movimiento migratorio"}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Adjunta una copia completamente legible.
                  </p>
                </div>
              </div>
              <Button
                variant={fileSimulations.comprobante === formData.causal ? "secondary" : "outline"}
                size="sm"
                type="button"
                onClick={() =>
                  setFileSimulations((p) => ({ ...p, comprobante: p.comprobante === formData.causal ? null : formData.causal }))
                }
              >
                {fileSimulations.comprobante === formData.causal ? (
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

      {/* Step 6: Solicitud Radicada con Éxito */}
      {currentStep === 6 && result && (
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
