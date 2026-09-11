"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { stopActiveMic } from "./voiceChannel";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Reproduce texto usando la API de síntesis de voz del navegador.
export function useSpeechSynthesis(lang = "es-GT") {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Comprueba soporte en cliente tras el montaje.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSupported(isSpeechSynthesisSupported());
    return () => {
      if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSpeechSynthesisSupported() || !text.trim()) return;
      window.speechSynthesis.cancel();
      // Detiene el micrófono activo antes de reproducir audio.
      stopActiveMic();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    },
    [lang]
  );

  return { speak, stop, isSpeaking, isSupported };
}
