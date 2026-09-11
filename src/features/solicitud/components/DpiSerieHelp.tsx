"use client";

import { Popover } from "@base-ui/react/popover";
import { CircleHelp, X } from "lucide-react";

export function DpiSerieHelp() {
  return (
    <Popover.Root>
      <Popover.Trigger
        type="button"
        openOnHover
        closeDelay={200}
        className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-blue-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <CircleHelp className="size-4" aria-hidden="true" />
        ¿Dónde encuentro la serie?
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" align="end" sideOffset={8} className="z-[100]">
          <Popover.Popup className="w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl">
            <div className="mb-2 flex items-start justify-between gap-2">
              <Popover.Title className="text-sm font-semibold">
                Serie del DPI
              </Popover.Title>
              <Popover.Close type="button" aria-label="Cerrar ayuda" className="rounded p-1 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600">
                <X className="size-4" aria-hidden="true" />
              </Popover.Close>
            </div>
            <Popover.Description className="mb-3 text-xs text-slate-600">
              Mira el video para ubicar la serie de tu DPI (4 dígitos).
            </Popover.Description>
            <video
              src="/ec.mp4"
              aria-label="Video de ayuda para encontrar la serie del DPI"
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="max-h-[45dvh] w-full rounded-lg bg-slate-950"
            >
              Tu navegador no admite este video. <a href="/ec.mp4">Ver video de ayuda</a>.
            </video>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
