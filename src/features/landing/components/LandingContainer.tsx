"use client";

import React, { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { CausalesSection } from "./CausalesSection";
import { PasosSection } from "./PasosSection";
import { SedesSection } from "./SedesSection";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";

// Cross-feature imports strictly from public APIs (index.ts) as required by AGENTS.md
import {
  useAgentChat,
  ChatDrawer,
  ChatEmbeddedSection,
  ChatFloatingButton,
} from "@/features/agent-chat";
import { useSolicitud, SolicitudModal } from "@/features/solicitud";

export const LandingContainer: React.FC = () => {
  const [isChatSectionVisible, setIsChatSectionVisible] = useState(true);
  const chatSectionAnchorRef = useRef<HTMLDivElement>(null);

  // Let the hero's text entrance animation finish (~1s) before guiding the
  // visitor down to the chat section, instead of yanking the page on load.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY < 40) {
        chatSectionAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  const {
    isOpen: isChatOpen,
    setIsOpen: setIsChatOpen,
    toggleOpen: toggleChat,
    messages,
    inputText,
    setInputText,
    isLoading: isChatLoading,
    sendMessage,
    resetSession,
  } = useAgentChat();

  const {
    isOpen: isSolicitudOpen,
    openModal: openSolicitud,
    closeModal: closeSolicitud,
    currentStep,
    formData,
    updateField,
    nextStep,
    prevStep,
    submitSolicitud,
    isSubmitting: isSolicitudSubmitting,
    result: solicitudResult,
  } = useSolicitud();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header Navigation */}
      <Header
        onOpenSolicitud={openSolicitud}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenSolicitud={openSolicitud}
          onOpenChat={() => setIsChatOpen(true)}
        />
        <div ref={chatSectionAnchorRef}>
          <ChatEmbeddedSection
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            isLoading={isChatLoading}
            onSendMessage={sendMessage}
            onResetSession={resetSession}
            onVisibilityChange={setIsChatSectionVisible}
          />
        </div>
        <CausalesSection />
        <PasosSection />
        <SedesSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Online Application Modal Wizard */}
      <SolicitudModal
        isOpen={isSolicitudOpen}
        onClose={closeSolicitud}
        currentStep={currentStep}
        formData={formData}
        updateField={updateField}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={submitSolicitud}
        isSubmitting={isSolicitudSubmitting}
        result={solicitudResult}
      />

      {/* Virtual PNC Assistant Centered Modal */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        inputText={inputText}
        setInputText={setInputText}
        isLoading={isChatLoading}
        onSendMessage={sendMessage}
        onResetSession={resetSession}
      />

      {/* Floating Action Button (with Magnetic Effect) — hidden while the embedded chat section up top is on screen */}
      <ChatFloatingButton
        onClick={toggleChat}
        isOpen={isChatOpen}
        hideForSection={isChatSectionVisible}
      />
    </div>
  );
};
