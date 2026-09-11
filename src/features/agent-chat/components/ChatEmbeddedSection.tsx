"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown, Mic, RotateCcw, Send, Sparkles, Square } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ChatMessageItem } from "./ChatMessageItem";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatMessage } from "../types";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";
import { Boxes } from "@/components/ui/background-boxes";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface ChatEmbeddedSectionProps {
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onResetSession: () => void;
  /** Notifica si la sección es visible en pantalla. */
  onVisibilityChange?: (isVisible: boolean) => void;
  /** Invita a desplazarse a las siguientes secciones. */
  onScrollDownInvite?: () => void;
}

export const ChatEmbeddedSection: React.FC<ChatEmbeddedSectionProps> = ({
  messages,
  inputText,
  setInputText,
  isLoading,
  onSendMessage,
  onResetSession,
  onVisibilityChange,
  onScrollDownInvite,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessagesRef = useRef(messages);
  const { isListening, isSupported: canListen, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => setInputText(transcript),
  });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !onVisibilityChange) return;

    const observer = new IntersectionObserver(
      ([entry]) => onVisibilityChange(entry.isIntersecting),
      { threshold: 0, rootMargin: "-96px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  // Desplaza automáticamente al recibir nuevos mensajes.
  useEffect(() => {
    if (messages !== lastMessagesRef.current) {
      lastMessagesRef.current = messages;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage();
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-3 sm:py-5 bg-gradient-to-b from-white via-gold-50/40 to-slate-50/70"
    >
       <BackgroundBeams />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-800 tracking-wider uppercase mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            ASISTENCIA INMEDIATA
          </span>
          <h3 className="font-display text-lg sm:text-2xl font-bold text-navy-900 tracking-tight mb-0.5">
            Conversa ahora con el Asistente Virtual PNC
          </h3>

        </div>

        {/* Panel de chat */}
        <div className="relative rounded-2xl">
          <GlowingEffect
            spread={45}
            glow
            disabled={false}
            proximity={80}
            inactiveZone={0.01}
            borderWidth={2}
            variant="gold"
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col">
            {/* Borde decorativo */}
            <div className="h-1 shrink-0 bg-gradient-to-r from-gold-500 via-brand-500 to-gold-500 bg-[length:200%_100%] animate-[shimmer_4s_linear_infinite]" />

            {/* Cabecera */}
            <div className="relative px-4 sm:px-5 py-3 flex items-center justify-between shrink-0 overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(160px 80px at 10% 0%, color-mix(in srgb, var(--color-gold-100) 70%, transparent), transparent), radial-gradient(200px 100px at 100% 100%, color-mix(in srgb, var(--color-brand-100) 60%, transparent), transparent)",
                }}
              />
              <div className="relative flex items-center gap-2.5">
                <div className="relative">
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 via-brand-600 to-navy-900 p-[1.5px] shadow-sm">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image src="/images.jpg" alt="Escudo Nacional de Guatemala" fill sizes="36px" className="object-cover" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight text-navy-900">
                    Asistente Virtual PNC
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    En línea · Marco Legal 59-2012
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onResetSession}
                title="Reiniciar conversación"
                className="relative p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent shrink-0" />

            {/* Mensajes */}
          <div className="h-[230px] sm:h-[220px] overflow-y-auto overscroll-contain px-4 sm:px-5 py-2.5 bg-[#fbfcfe] space-y-2">
            {messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias */}
          <div className="px-3 sm:px-4 border-t border-slate-100 bg-white shrink-0">
            <ChatSuggestions disabled={isLoading} onSelect={(prompt) => onSendMessage(prompt)} />
          </div>

          {/* Entrada de texto */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 sm:p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                inputMode="text"
                enterKeyHint="send"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Escuchando..." : "Escribe tu pregunta aquí..."}
                disabled={isLoading}
                className="w-full pl-4 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-600/20 transition-all text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
              />
            </div>
            {canListen && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                title={isListening ? "Detener dictado" : "Dictar por voz"}
                aria-label={isListening ? "Detener dictado" : "Dictar por voz"}
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer disabled:opacity-40",
                  isListening
                    ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors shrink-0 shadow-xs cursor-pointer"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          </div>
        </div>

        {/* Botón de desplazamiento */}
        <motion.button
          type="button"
          onClick={onScrollDownInvite}
          className="group mt-5 flex w-full flex-col items-center gap-1 text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-semibold tracking-wide">
            Conoce más sobre el trámite
          </span>
          <ChevronDown className="w-5 h-5 text-gold-600 group-hover:text-gold-700" />
        </motion.button>
      </div>
    </section>
  );
};
