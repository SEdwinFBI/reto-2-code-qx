"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { RotateCcw, X, Send } from "lucide-react";
import { ChatMessageItem } from "./ChatMessageItem";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatMessage } from "../types";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onResetSession: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  inputText,
  setInputText,
  isLoading,
  onSendMessage,
  onResetSession,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, messages]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Semi-transparent Backdrop for centered modal */}
      <div
        className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered Chat Window Container */}
      <div
        className="relative z-10 w-full max-w-xl h-[min(680px,90dvh)]
          bg-white rounded-2xl shadow-2xl border border-slate-200/90
          flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
      >
        {/* Chat Header */}
        <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between shadow-xs shrink-0 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-500/50 shadow-inner">
                <Image src="/images.jpg" alt="Escudo Nacional de Guatemala" fill sizes="40px" className="object-cover" />
              </div>
              {/* Online green indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-navy-900 rounded-full" />
            </div>
            <div>
              <h4
                id="chat-title"
                className="font-display font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-2"
              >
                Asistente Virtual PNC
              </h4>
              <p className="text-[11px] sm:text-xs text-blue-200/80">
                En línea · Asesoría Legal Acuerdo Gubernativo 59-2012
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetSession}
              title="Reiniciar conversación"
              className="p-2 text-blue-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Cerrar chat"
              className="p-2 text-blue-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area - Centered flow */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 bg-[#fbfcfe] space-y-3">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 sm:px-6 py-1 border-t border-slate-100 bg-white shrink-0">
          <ChatSuggestions
            disabled={isLoading}
            onSelect={(prompt) => onSendMessage(prompt)}
          />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2.5 shrink-0"
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              enterKeyHint="send"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta algo o responde..."
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
  );
};
