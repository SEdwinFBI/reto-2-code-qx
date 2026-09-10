"use client";

import React from "react";
import { motion } from "motion/react";
import { MessageSquare, Shield } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

interface ChatFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  /** Hide the launcher while the embedded chat section up top is still on screen. */
  hideForSection?: boolean;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({
  onClick,
  isOpen,
  hideForSection = false,
}) => {
  if (isOpen || hideForSection) return null;

  return (
    <div className="fixed z-40 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
      <motion.div
        className="pointer-events-auto"
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [30, 0, 0, -34, 0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { type: "spring", stiffness: 260, damping: 18 },
          y: {
            duration: 2.1,
            times: [0, 0.22, 0.55, 0.68, 0.81, 0.9, 1],
            ease: "easeInOut",
            delay: 0.6,
            repeat: 2,
            repeatDelay: 9,
          },
        }}
      >
        <MagneticButton strength={0.4} maxDistance={30}>
      
          <HoverBorderGradient
          color="red"
            as="button"
            onClick={onClick}
            className="group flex items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 cursor-pointer border border-brand-400/40 active:scale-95 whitespace-nowrap"
            aria-label="Abrir Asistente Virtual PNC"
          >
            {/* Emblem Avatar with green dot */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-navy-900 border border-gold-500/50 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold-100" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-brand-600 rounded-full" />
            </div>

            {/* Text Labels */}
            <div className="flex text-left flex-col">
              <span className="font-display text-xs sm:text-sm font-bold leading-tight tracking-tight text-white">
                Asistente Virtual PNC
              </span>
              <span className="text-[10px] sm:text-[11px] text-brand-100/90 leading-tight">
                Exonera tu multa online
              </span>
            </div>

            {/* Chat icon */}
            <div className="ml-0.5 text-white/90">
              <MessageSquare className="w-4 h-4 fill-white/20" />
            </div>
          </HoverBorderGradient>
        </MagneticButton>
      </motion.div>
    </div>
  );
};
