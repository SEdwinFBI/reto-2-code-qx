"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "../types";
import { sendMessageToAgent } from "../services/agentService";

function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "pnc_chat_";
  while (result.length < 36) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    text: "¡Hola! Soy el Asistente Virtual de Tránsito de la PNC. Te ayudo a evaluar si tu caso aplica para exoneración del 100% de la multa por fuerza mayor bajo el Acuerdo Gubernativo 59-2012.\n\n¿Tu licencia ya venció o deseas consultar causales y requisitos?",
    timestamp: "Ahora",
  },
];

export function useAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputText).trim();
      if (!text || isLoading) return;

      const userMsgId = "msg-" + Date.now();
      const userMsg: ChatMessage = {
        id: userMsgId,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const assistantMsgId = "bot-" + (Date.now() + 1);
      const assistantPlaceholder: ChatMessage = {
        id: assistantMsgId,
        sender: "assistant",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setInputText("");
      setIsLoading(true);

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await sendMessageToAgent(
          {
            message: text,
            sessionId: sessionIdRef.current,
          },
          (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, text: m.text + chunk, isStreaming: true }
                  : m
              )
            );
          },
          controller.signal
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error("Chat error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Ocurrió un error inesperado";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text:
                    m.text.length > 0
                      ? `${m.text}\n\n⚠️ La respuesta se interrumpió: ${errorMessage}`
                      : `No se pudo conectar con el servidor: ${errorMessage}. Por favor intenta de nuevo.`,
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [inputText, isLoading]
  );

  const resetSession = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    sessionIdRef.current = generateSessionId();
    setIsLoading(false);
    setMessages([
      {
        id: "welcome-reset-" + Date.now(),
        sender: "assistant",
        text: "Sesión reiniciada. ¿En qué podemos ayudarte para tu trámite de exoneración?",
        timestamp: "Ahora",
      },
    ]);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
    messages,
    inputText,
    setInputText,
    isLoading,
    sendMessage: handleSendMessage,
    resetSession,
  };
}
