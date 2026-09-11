"use client";

import React from "react";
import { motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { MessageSquare } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const ASSISTANT_LOTTIE_SRC =
  "https://lottie.host/6165cac7-604a-4f50-bfe7-f43641f6ad0f/kzt7y2RoGV.lottie";

interface ChatFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  /** Oculta el botón si la sección superior de chat está visible. */
  hideForSection?: boolean;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({
  onClick,
  isOpen,
  hideForSection = false,
}) => {
  if (isOpen || hideForSection) return null;

  return (
    <div className="fixed z-[80] bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
      <motion.div
        className="pointer-events-auto relative"
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
          <div className="relative">
            {/* Mascota virtual animada */}
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24">
              <DotLottieReact src={ASSISTANT_LOTTIE_SRC} loop autoplay className="w-full h-full" />
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
            </div>

            <HoverBorderGradient
            color="red"
              as="button"
              onClick={onClick}
              className="group flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white pl-4 pr-4 py-2.5 sm:pl-5 sm:pr-5 sm:py-2.5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 cursor-pointer border border-brand-400/40 active:scale-95 whitespace-nowrap"
              aria-label="Abrir Asistente Virtual PNC"
            >
              <div className="flex text-left flex-col">
                <span className="font-display text-xs sm:text-sm font-bold leading-tight tracking-tight text-white">
                  Asistente Virtual PNC
                </span>
                <span className="text-[10px] sm:text-[11px] text-brand-100/90 leading-tight">
                  Exonera tu multa online
                </span>
              </div>

              <div className="ml-0.5 text-white/90">
                <MessageSquare className="w-4 h-4 fill-white/20" />
              </div>
            </HoverBorderGradient>
          </div>
        </MagneticButton>
      </motion.div>
    </div>
  );
};
