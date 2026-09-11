"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { registerActiveMic, stopActiveSpeech } from "./voiceChannel";

interface MinimalSpeechRecognitionResult {
  transcript: string;
}

interface MinimalSpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [index: number]: { [index: number]: MinimalSpeechRecognitionResult };
  };
}

interface MinimalSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: MinimalSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => MinimalSpeechRecognition;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

interface UseSpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  lang?: string;
}

// Maneja el reconocimiento de voz continuo mediante Web Speech API.
export function useSpeechRecognition({ onResult, lang = "es-GT" }: UseSpeechRecognitionOptions) {
  // Estado inicial seguro para SSR.
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Detección de soporte en cliente tras el montaje.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: MinimalSpeechRecognitionEvent) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i]?.[0]?.transcript ?? "";
      }
      if (combined) onResultRef.current(combined);
    };
    recognition.onerror = () => {
      setIsListening(false);
      registerActiveMic(null);
    };
    recognition.onend = () => {
      setIsListening(false);
      registerActiveMic(null);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, [lang]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    registerActiveMic(null);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    // Detiene la reproducción de voz antes de activar el micrófono.
    stopActiveSpeech();
    try {
      recognitionRef.current.start();
      setIsListening(true);
      registerActiveMic(stopListening);
    } catch {
      // Ignora si ya estaba iniciado.
    }
  }, [isListening, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return { isListening, isSupported, startListening, stopListening, toggleListening };
}
