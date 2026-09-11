"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenSolicitud: () => void;
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSolicitud, onOpenChat }) => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const scrolledDown = currentY > lastScrollY.current;
        const pastThreshold = currentY > 96;
        setIsHidden(scrolledDown && pastThreshold);
        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-transform duration-300 ease-in-out",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Emblem */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gold-500/70 shadow-sm shrink-0">
            <Image
              src="/images.jpg"
              alt="Escudo Nacional de Guatemala"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-sm sm:text-lg font-bold text-navy-900 tracking-tight leading-tight truncate">
              Exoneración de Multas de Tránsito
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
              Policía Nacional Civil · Guatemala C.A.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSolicitud}
            className="hidden md:inline-flex bg-brand-50/40 hover:bg-brand-50 border-brand-200 text-brand-600 font-medium"
          >
            <FileText className="w-4 h-4" />
            <span>Llenar solicitud de exoneración</span>
          </Button>

          <MagneticButton strength={0.3} maxDistance={20}>
            <Button
              size="sm"
              onClick={onOpenChat}
              className="font-medium shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chatear con el Asistente</span>
              <span className="sm:hidden">Asistente</span>
            </Button>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
};
