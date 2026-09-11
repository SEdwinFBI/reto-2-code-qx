"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speaks a given piece of text aloud using the browser's SpeechSynthesis API. */
export function useSpeechSynthesis(lang = "es-GT") {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Support depends on `window`, only known after mount — kept out of render so
  // SSR output stays stable beforehand.
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
