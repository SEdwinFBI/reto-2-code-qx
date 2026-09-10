"use client";

import React, { useRef, useEffect } from "react";
import { RotateCcw, X, Send, Shield } from "lucide-react";
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage();
  };

  return (
    <div
      className="fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-4 sm:right-4
        w-full sm:w-[420px] h-[min(640px,92dvh)] sm:h-[640px] sm:max-h-[85dvh]
        bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200/80
        flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200"
    >
      {/* Chat Header */}
      <div className="bg-navy-900 text-white px-4 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-navy-950 border border-gold-500/50 flex items-center justify-center text-blue-200 shadow-inner">
              <Shield className="w-5 h-5 text-gold-100" />
            </div>
            {/* Online green indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-navy-900 rounded-full" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-2">
              Asistente Virtual PNC
            </h4>
            <p className="text-[11px] text-blue-200/80">En línea · Marco Legal 59-2012</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
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
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3 bg-[#fbfcfe] space-y-2">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 border-t border-slate-100 bg-white shrink-0">
        <ChatSuggestions
          disabled={isLoading}
          onSelect={(prompt) => onSendMessage(prompt)}
        />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
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
            className="w-full pl-3.5 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 focus:bg-white focus:ring-1 focus:ring-brand-600 transition-all text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors shrink-0 shadow-xs cursor-pointer"
          aria-label="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
