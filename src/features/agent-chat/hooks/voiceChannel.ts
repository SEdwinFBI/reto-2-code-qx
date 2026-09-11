// Coordinación global de exclusión mutua entre micrófono y lectura por voz.
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
