"use client";

import React, { useEffect, useRef } from "react";
import { RotateCcw, Send, Shield, Sparkles } from "lucide-react";
import { ChatMessageItem } from "./ChatMessageItem";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatMessage } from "../types";

interface ChatEmbeddedSectionProps {
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onResetSession: () => void;
  /** Fired whenever the section enters/leaves the viewport, so the page can show
   * the floating launcher only once this section has scrolled out of view. */
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const ChatEmbeddedSection: React.FC<ChatEmbeddedSectionProps> = ({
  messages,
  inputText,
  setInputText,
  isLoading,
  onSendMessage,
  onResetSession,
  onVisibilityChange,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessagesRef = useRef(messages);

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

  // Only auto-scroll the message list when it actually changed (a new message was
  // added), never on mount — a boolean "first render" ref gets defeated by React's
  // dev-mode StrictMode double-invoking effects, so compare the array identity instead.
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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-slate-50/60 border-t border-slate-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-800 tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ASISTENCIA INMEDIATA
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-3">
            Conversa ahora con el Asistente Virtual PNC
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Pregunta directamente aquí si tu caso califica, qué documentos necesitas o dónde presentarlos.
          </p>
        </div>

        {/* Embedded Chat Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-navy-900 text-white px-4 sm:px-5 py-3.5 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-navy-950 border border-gold-500/50 flex items-center justify-center shadow-inner">
                  <Shield className="w-5 h-5 text-gold-100" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-navy-900 rounded-full" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm sm:text-base tracking-tight text-white">
                  Asistente Virtual PNC
                </h4>
                <p className="text-[11px] sm:text-xs text-blue-200/80">
                  En línea · Marco Legal 59-2012
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetSession}
              title="Reiniciar conversación"
              className="p-2 text-blue-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[420px] sm:h-[460px] overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 bg-[#fbfcfe] space-y-2">
            {messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-3 sm:px-4 border-t border-slate-100 bg-white shrink-0">
            <ChatSuggestions disabled={isLoading} onSelect={(prompt) => onSendMessage(prompt)} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2.5 shrink-0"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                inputMode="text"
                enterKeyHint="send"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                disabled={isLoading}
                className="w-full pl-4 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-600/20 transition-all text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors shrink-0 shadow-xs cursor-pointer"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
