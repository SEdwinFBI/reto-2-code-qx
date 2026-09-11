"use client";

import { useState } from "react";
import type { Locale } from "../i18n/types";

type Location = { latitude: number; longitude: number };

export type LocationErrorCode = "unsupported" | "denied" | "unknown" | null;

// Google Maps doesn't support K'iche' as a UI language — fall back to Spanish.
function mapsUiLanguage(locale: Locale): string {
  return locale === "en" ? "en" : "es";
}

export function useSedesLocation(locale: Locale = "es") {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationErrorCode, setLocationErrorCode] = useState<LocationErrorCode>(null);

  const handleUpdateGps = () => {
    setLocationErrorCode(null);
    if (!window.isSecureContext || !navigator.geolocation) {
      setLocationErrorCode("unsupported");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setIsLocating(false);
      },
      (error) => {
        setLocationErrorCode(error.code === 1 ? "denied" : "unknown");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  // Google Maps resolves the search results; no office data is fabricated locally.
  // The search query text itself stays in Spanish regardless of locale — it's a
  // technical parameter for Google's own index, not UI copy.
  const center = location ? `${location.latitude},${location.longitude}` : null;
  const query = center
    ? `Departamento de Tránsito PNC Guatemala cerca de ${center}`
    : "Departamento de Tránsito PNC Guatemala";
  const embedParams = new URLSearchParams({
    q: query,
    output: "embed",
    hl: mapsUiLanguage(locale),
    z: center ? "12" : "7",
  });
  if (center) embedParams.set("ll", center);
  const searchParams = new URLSearchParams({ api: "1", query });

  return {
    isLocating,
    locationErrorCode,
    gpsActive: !!location,
    handleUpdateGps,
    mapUrl: `https://www.google.com/maps?${embedParams}`,
    searchUrl: `https://www.google.com/maps/search/?${searchParams}`,
  };
}
