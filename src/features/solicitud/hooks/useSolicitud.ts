"use client";

import { useState } from "react";
import { SolicitudFormData, SolicitudResult } from "../types";

const INITIAL_DATA: SolicitudFormData = {
  cui: "",
  fechaNacimiento: "",
  serie: "",
  nacionalidad: "",
  numeroLicencia: "",
  paisEmisionLicencia: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  correo: "",
  causal: "25",
  fechaVencimiento: "",
  fechaHecho: "",
  observaciones: "",
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

  const updateField = (field: keyof SolicitudFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ...(["cui", "fechaNacimiento", "serie"].includes(field)
        ? { nombres: "", apellidos: "", nacionalidad: "", numeroLicencia: "", paisEmisionLicencia: "" }
        : {}),
      [field]: value,
    }));
  };

  const consultarPersona = () => {
    // Consulta de demostración, al igual que el envío actual del formulario.
    // Sustituir estos datos cuando se conecte el servicio de identidad.
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
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitSolicitud = async () => {
    setIsSubmitting(true);
    // Simulate brief processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const causalMap: Record<string, string> = {
      "24": "Casilla 24: Estar Fuera del País (GAE 3111)",
      "25": "Casilla 25: Enfermedad o Accidente (GAE 3112)",
      "26": "Casilla 26: Privado de Libertad (GAE 3113)",
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
    });

    setCurrentStep(4);
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
