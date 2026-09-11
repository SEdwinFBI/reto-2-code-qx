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

/**
 * Wraps the browser's Web Speech API for voice-to-text dictation into the chat
 * input. Runs in continuous mode with interim results, so it keeps listening
 * (and keeps updating the input live) through natural pauses instead of
 * closing after the first thing said — only a manual stop (or unmount) ends it.
 */
export function useSpeechRecognition({ onResult, lang = "es-GT" }: UseSpeechRecognitionOptions) {
  // Always false on the server/first paint so SSR and the pre-hydration DOM match;
  // flipped after mount once we can actually check for browser support.
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Browser capability detection depends on `window`, which only exists after
  // mount, so setting state here is unavoidable — there is no SSR-safe,
  // render-time alternative for this check.
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
    // Voice input and voice output are mutually exclusive — starting the mic
    // stops any reply currently being read aloud.
    stopActiveSpeech();
    try {
      recognitionRef.current.start();
      setIsListening(true);
      registerActiveMic(stopListening);
    } catch {
      // Recognition was already running — ignore.
    }
  }, [isListening, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return { isListening, isSupported, startListening, stopListening, toggleListening };
}
