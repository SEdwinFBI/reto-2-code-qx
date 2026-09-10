"use client";

import React from "react";
import { MessageSquare, Shield } from "lucide-react";

interface ChatFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({
  onClick,
  isOpen,
}) => {
  if (isOpen) return null;

  return (
    <div className="fixed z-40 [bottom:calc(1.1rem+env(safe-area-inset-bottom))] [right:calc(1.1rem+env(safe-area-inset-right))]">
      <button
        type="button"
        onClick={onClick}
        className="group flex items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white p-3.5 sm:pl-2 sm:pr-4 sm:py-2 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer border border-brand-400/30 active:scale-95"
        aria-label="Abrir Asistente Virtual PNC"
      >
        {/* Emblem Avatar with green dot */}
        <div className="relative flex items-center justify-center">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-navy-900 border border-gold-500/50 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold-100" />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-brand-600 rounded-full" />
        </div>

        {/* Text Labels (desktop only — icon-only FAB on small screens) */}
        <div className="hidden sm:flex text-left flex-col">
          <span className="font-display text-xs font-bold leading-tight tracking-tight text-white">
            Asistente Virtual PNC
          </span>
          <span className="text-[11px] text-brand-100/90 leading-tight">
            Exonera tu multa online
          </span>
        </div>

        {/* Chat icon */}
        <div className="hidden sm:block ml-1 text-white/90">
          <MessageSquare className="w-4 h-4 fill-white/20" />
        </div>
      </button>
    </div>
  );
};
