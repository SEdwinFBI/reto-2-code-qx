/**
 * Keeps voice input (speech-to-text) and voice output (text-to-speech) mutually
 * exclusive across the whole app: starting one stops the other. Plain
 * module-level state on purpose — `useSpeechRecognition` and `useSpeechSynthesis`
 * are each instantiated multiple times (one recognizer per chat surface, one
 * synthesizer per message bubble), so this needs to be shared outside React's
 * tree rather than passed down as props.
 */
let activeMicStop: (() => void) | null = null;

export function registerActiveMic(stopFn: (() => void) | null): void {
  activeMicStop = stopFn;
}

export function stopActiveMic(): void {
  activeMicStop?.();
  activeMicStop = null;
}

export function stopActiveSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
