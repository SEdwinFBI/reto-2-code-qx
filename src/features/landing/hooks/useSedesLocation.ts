"use client";

import { useState } from "react";

type Location = { latitude: number; longitude: number };

export function useSedesLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleUpdateGps = () => {
    setLocationError("");
    if (!window.isSecureContext || !navigator.geolocation) {
      setLocationError("La ubicación no está disponible en este navegador. Puedes explorar las oficinas directamente en el mapa.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(error.code === 1
          ? "No se autorizó el acceso a tu ubicación. Habilita el permiso para buscar cerca de ti o explora el mapa."
          : "No pudimos obtener tu ubicación. Inténtalo de nuevo o explora el mapa.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  // Google Maps resolves the search results; no office data is fabricated locally.
  const center = location ? `${location.latitude},${location.longitude}` : null;
  const query = center
    ? `Departamento de Tránsito PNC Guatemala cerca de ${center}`
    : "Departamento de Tránsito PNC Guatemala";
  const embedParams = new URLSearchParams({ q: query, output: "embed", hl: "es", z: center ? "12" : "7" });
  if (center) embedParams.set("ll", center);
  const searchParams = new URLSearchParams({ api: "1", query });

  return {
    isLocating,
    locationError,
    gpsActive: !!location,
    handleUpdateGps,
    mapUrl: `https://www.google.com/maps?${embedParams}`,
    searchUrl: `https://www.google.com/maps/search/?${searchParams}`,
  };
}
