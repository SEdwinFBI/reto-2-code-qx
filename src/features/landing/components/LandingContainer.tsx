"use client";

import React, { useRef, useState } from "react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { CausalesSection } from "./CausalesSection";
import { PasosSection } from "./PasosSection";
import { SedesSection } from "./SedesSection";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";
import { KicheDisclaimerBanner } from "./KicheDisclaimerBanner";
import { LanguageProvider } from "../i18n/LanguageContext";

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
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const scrollToHero = () => {
    heroSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
    consultarPersona,
    nextStep,
    prevStep,
    submitSolicitud,
    isSubmitting: isSolicitudSubmitting,
    result: solicitudResult,
  } = useSolicitud();

  return (
    <LanguageProvider>
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* K'iche' preliminary-translation notice — only visible in that locale */}
      <KicheDisclaimerBanner />

      {/* Header Navigation */}
      <Header
        onOpenSolicitud={openSolicitud}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        <ChatEmbeddedSection
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          isLoading={isChatLoading}
          onSendMessage={sendMessage}
          onResetSession={resetSession}
          onVisibilityChange={setIsChatSectionVisible}
          onScrollDownInvite={scrollToHero}
        />
        <div ref={heroSectionRef} className="scroll-mt-20">
          <HeroSection
            onOpenSolicitud={openSolicitud}
            onOpenChat={() => setIsChatOpen(true)}
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
        onConsultarPersona={consultarPersona}
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
    </LanguageProvider>
  );
};
