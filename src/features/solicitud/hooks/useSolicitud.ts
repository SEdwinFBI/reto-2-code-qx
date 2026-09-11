"use client";

import { useEffect, useRef, useState } from "react";
import { readErrorMessage } from "@/lib/http";
import { solicitudFormSchema, type PerfilPrueba } from "@/lib/validation/solicitud";
import { ConsultaEstado, SolicitudFormData, SolicitudResult } from "../types";
import { clearSolicitudDraft, loadSolicitudDraft, saveSolicitudDraft } from "../lib/solicitudDraft";

const INITIAL_DATA: SolicitudFormData = {
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
  fechaVencimiento: "",
  fechaHecho: "",
  numerosDocumento: [""],
  observaciones: "",
  archivoDpi: null,
  archivoComprobante: null,
  archivoAutorizacion: null,
  esGestionadoPorTercero: false,
  gestorNombreCompleto: "",
  gestorCui: "",
  gestorRelacion: "",
  gestorTelefono: "",
  gestorCorreo: "",
  esEmpleadoGobierno: false,
  empleadoPuesto: "",
  empleadoInstitucion: "",
};

export function useSolicitud() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<SolicitudFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SolicitudResult | null>(null);
  const [consultaEstado, setConsultaEstado] = useState<ConsultaEstado>("idle");
  const [error, setError] = useState<string | null>(null);
  const [draftRestaurado, setDraftRestaurado] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openModal = () => {
    setResult(null);
    setError(null);
    setConsultaEstado("idle");

    const draft = loadSolicitudDraft();
    if (draft) {
      setFormData({ ...INITIAL_DATA, ...draft.formData, archivoDpi: null, archivoComprobante: null, archivoAutorizacion: null });
      setCurrentStep(draft.currentStep);
      setDraftRestaurado(true);
    } else {
      setFormData(INITIAL_DATA);
      setCurrentStep(1);
      setDraftRestaurado(false);
    }

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    clearSolicitudDraft();
    setDraftRestaurado(false);
  };

  // Guardado automático del borrador (con debounce) mientras el modal está abierto,
  // salvo en el paso final (6), donde la solicitud ya se radicó.
  useEffect(() => {
    if (!isOpen || currentStep === 6) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveSolicitudDraft(currentStep, formData);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [isOpen, currentStep, formData]);

  const updateField = <K extends keyof SolicitudFormData>(field: K, value: SolicitudFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      ...(["cui", "fechaNacimiento", "serie"].includes(field)
        ? { nombres: "", apellidos: "", nacionalidad: "", numeroLicencia: "", paisEmisionLicencia: "" }
        : {}),
      [field]: value,
    }));
    if (["cui", "fechaNacimiento", "serie"].includes(field)) {
      setConsultaEstado("idle");
    }
  };

  // Consulta de identidad contra perfiles de prueba o servicio de identidad.
  const consultarPersona = async () => {
    if (consultaEstado === "loading") return;
    setConsultaEstado("loading");
    setError(null);

    try {
      const response = await fetch("/api/consulta-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cui: formData.cui,
          fechaNacimiento: formData.fechaNacimiento,
          serie: formData.serie,
        }),
      });

      if (response.status === 404) {
        setConsultaEstado("no-encontrado");
        return;
      }

      if (!response.ok) {
        setError(await readErrorMessage(response, "No se pudo realizar la consulta."));
        setConsultaEstado("idle");
        return;
      }

      const perfil = (await response.json()) as PerfilPrueba;
      setFormData((prev) => ({
        ...prev,
        esTrabajadorPublico: perfil.esTrabajadorPublico,
        solicitaAbogado: perfil.solicitaAbogado,
        institucionYPuesto: perfil.institucionYPuesto,
        numeroColegiadoActivo: perfil.numeroColegiadoActivo,
        nacionalidad: perfil.nacionalidad,
        numeroLicencia: perfil.numeroLicencia,
        paisEmisionLicencia: perfil.paisEmisionLicencia,
        nombres: perfil.nombres,
        apellidos: perfil.apellidos,
        telefono: perfil.telefono,
        telefonoAlternativo: perfil.telefonoAlternativo,
        correo: perfil.correo,
        causal: perfil.causal as SolicitudFormData["causal"],
        fechaVencimiento: perfil.fechaVencimiento,
        fechaHecho: perfil.fechaHecho,
        numerosDocumento: perfil.numerosDocumento,
        observaciones: perfil.observaciones,
        esGestionadoPorTercero: perfil.esGestionadoPorTercero,
        gestorNombreCompleto: perfil.gestorNombreCompleto,
        gestorCui: perfil.gestorCui,
        gestorRelacion: perfil.gestorRelacion,
        gestorTelefono: perfil.gestorTelefono,
        gestorCorreo: perfil.gestorCorreo,
        esEmpleadoGobierno: perfil.esEmpleadoGobierno,
        empleadoPuesto: perfil.empleadoPuesto,
        empleadoInstitucion: perfil.empleadoInstitucion,
      }));
      setConsultaEstado("encontrado");
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
      setConsultaEstado("idle");
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitSolicitud = async () => {
    setError(null);

    const parsed = solicitudFormSchema.safeParse({
      cui: formData.cui,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      correo: formData.correo,
      causal: formData.causal,
      fechaVencimiento: formData.fechaVencimiento,
      fechaHecho: formData.fechaHecho,
      observaciones: formData.observaciones,
      esGestionadoPorTercero: formData.esGestionadoPorTercero,
      gestorNombreCompleto: formData.esGestionadoPorTercero ? formData.gestorNombreCompleto : undefined,
      gestorCui: formData.esGestionadoPorTercero ? formData.gestorCui : undefined,
      gestorRelacion: formData.esGestionadoPorTercero ? formData.gestorRelacion : undefined,
      gestorTelefono: formData.esGestionadoPorTercero ? formData.gestorTelefono : undefined,
      gestorCorreo: formData.esGestionadoPorTercero ? formData.gestorCorreo : undefined,
      esEmpleadoGobierno: formData.esEmpleadoGobierno,
      empleadoPuesto: formData.esEmpleadoGobierno ? formData.empleadoPuesto : undefined,
      empleadoInstitucion: formData.esEmpleadoGobierno ? formData.empleadoInstitucion : undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues.map((issue) => issue.message).join(" | "));
      return;
    }

    if (!formData.archivoDpi || !formData.archivoComprobante) {
      setError("Debes adjuntar el DPI y el comprobante correspondiente a tu causal.");
      return;
    }

    if (formData.esGestionadoPorTercero && !formData.archivoAutorizacion) {
      setError("Debes adjuntar el documento de autorización/carta poder del gestor.");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.set("cui", formData.cui);
      body.set("nombres", formData.nombres);
      body.set("apellidos", formData.apellidos);
      body.set("telefono", formData.telefono);
      body.set("correo", formData.correo);
      body.set("causal", formData.causal);
      body.set("fechaVencimiento", formData.fechaVencimiento);
      body.set("fechaHecho", formData.fechaHecho);
      body.set("observaciones", formData.observaciones);

      body.set("esGestionadoPorTercero", String(formData.esGestionadoPorTercero));
      if (formData.esGestionadoPorTercero) {
        body.set("gestorNombreCompleto", formData.gestorNombreCompleto);
        body.set("gestorCui", formData.gestorCui);
        body.set("gestorRelacion", formData.gestorRelacion);
        body.set("gestorTelefono", formData.gestorTelefono);
        body.set("gestorCorreo", formData.gestorCorreo);
      }

      body.set("esEmpleadoGobierno", String(formData.esEmpleadoGobierno));
      if (formData.esEmpleadoGobierno) {
        body.set("empleadoPuesto", formData.empleadoPuesto ?? "");
        body.set("empleadoInstitucion", formData.empleadoInstitucion ?? "");
      }

      body.set("archivoDpi", formData.archivoDpi);
      body.set("archivoComprobante", formData.archivoComprobante);
      if (formData.esGestionadoPorTercero && formData.archivoAutorizacion) {
        body.set("archivoAutorizacion", formData.archivoAutorizacion);
      }

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        setError(await readErrorMessage(response, "No se pudo radicar la solicitud."));
        return;
      }

      const data = (await response.json()) as SolicitudResult;
      setResult({
        numeroExpediente: data.numeroExpediente,
        fechaRadicacion: new Date(data.fechaRadicacion).toLocaleDateString("es-GT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        plazoDiasHabiles: data.plazoDiasHabiles,
        causalNombre: data.causalNombre,
        urlSeguimiento: data.urlSeguimiento,
      });
      setCurrentStep(6);
      clearSolicitudDraft();
      setDraftRestaurado(false);
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    currentStep,
    formData,
    updateField,
    consultaEstado,
    consultarPersona,
    nextStep,
    prevStep,
    submitSolicitud,
    isSubmitting,
    result,
    error,
    draftRestaurado,
  };
}
