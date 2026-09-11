"use client";

import { useState } from "react";
import { SolicitudFormData, SolicitudResult } from "../types";

const INITIAL_DATA: SolicitudFormData = {
  tramitaTercero: false,
  terceroCui: "",
  terceroNombreCompleto: "",
  terceroParentesco: "",
  terceroCorreo: "",
  terceroTelefono: "",
  esTrabajadorPublico: false,
  solicitaAbogado: false,
  institucionYPuesto: "",
  numeroColegiadoActivo: "",
  cui: "",
  fechaNacimiento: "",
  serie: "",
  nacionalidad: "",
  numeroLicencia: "",
  paisEmisionLicencia: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  telefonoAlternativo: "",
  correo: "",
  causal: "ENFERMEDAD_ACCIDENTE",
  numerosDocumento: [""],
  observaciones: "",
  esGestionadoPorTercero: false,
  esEmpleadoGobierno: false,
};

export function useSolicitud() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<SolicitudFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SolicitudResult | null>(null);

  const openModal = () => {
    setCurrentStep(1);
    setResult(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const updateField = <K extends keyof SolicitudFormData>(field: K, value: SolicitudFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      ...(["cui", "fechaNacimiento", "serie"].includes(field)
        ? { nombres: "", apellidos: "", nacionalidad: "", numeroLicencia: "", paisEmisionLicencia: "" }
        : {}),
      [field]: value,
    }));
  };

  const consultarPersona = () => {
    // Simulación de consulta de identidad (RENAP / Maycom).
    setFormData((prev) => ({
      ...prev,
      nombres: "Persona",
      apellidos: "de demostración",
      nacionalidad: "Guatemalteca",
      numeroLicencia: "0000000000000",
      paisEmisionLicencia: "Guatemala",
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitSolicitud = async () => {
    setIsSubmitting(true);
    // Simulación de tiempo de procesamiento de envío.
    await new Promise((resolve) => setTimeout(resolve, 800));

    const causalMap: Record<string, string> = {
      FUERA_DEL_PAIS: "Casilla 24: Estar Fuera del País (GAE 3111)",
      ENFERMEDAD_ACCIDENTE: "Casilla 25: Enfermedad o Accidente (GAE 3112)",
      PRIVADO_LIBERTAD: "Casilla 26: Privado de Libertad (GAE 3113)",
    };

    const generatedExp = `EXP-PNC-${Math.floor(100000 + Math.random() * 900000)}-2026`;
    setResult({
      numeroExpediente: generatedExp,
      fechaRadicacion: new Date().toLocaleDateString("es-GT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      plazoDiasHabiles: 20,
      causalNombre: causalMap[formData.causal] || "Causal de Fuerza Mayor",
      urlSeguimiento: "",
    });

    setCurrentStep(6);
    setIsSubmitting(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    currentStep,
    formData,
    updateField,
    consultarPersona,
    nextStep,
    prevStep,
    submitSolicitud,
    isSubmitting,
    result,
  };
}
