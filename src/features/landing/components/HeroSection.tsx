"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import { FileText, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Highlight } from "@/components/ui/hero-highlight";
import { useLanguage } from "../i18n/LanguageContext";
import { RichText } from "../i18n/RichText";

const textContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

interface HeroSectionProps {
  onOpenSolicitud: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSolicitud,
  onOpenChat,
}) => {
  const { dict } = useLanguage();
  return (
    <section className="relative overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-10 bg-linear-to-b from-blue-50/40 via-white to-white">
      <BackgroundRippleEffect rows={13} cols={34} cellSize={48} />
      <motion.div
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={textContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Pill Tag */}
        <motion.div
          variants={textItem}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-200/80 mb-3 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-800" />
          <span className="text-xs font-semibold text-gold-800 tracking-wide">
            {dict.hero.eyebrow}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          variants={textItem}
          className="font-display text-3xl sm:text-5xl lg:text-5xl font-bold text-navy-900 tracking-tight leading-[1.15] mb-3"
        >
          {dict.hero.headingLine1} <br />
          <Highlight
          className="text-white">
          {dict.hero.headingLine2}
          </Highlight>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={textItem}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-4 leading-relaxed font-normal"
        >
          <RichText text={dict.hero.subtitle} />
        </motion.p>



        {/* 3 Stat Cards in a row */}


        <motion.div
          variants={textItem}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-4"
        >
          {/* Card 1 */}
          <div className="relative bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs text-center transition-transform hover:-translate-y-0.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
              variant="blue"
            />
            <div className="relative z-10">
              <div className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
                {dict.hero.stat1Value}
              </div>
              <div className="text-xs font-medium text-slate-500">{dict.hero.stat1Caption}</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs text-center transition-transform hover:-translate-y-0.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
                variant="blue"
            />
            <div className="relative z-10">
              <div className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
                {dict.hero.stat2Value}
              </div>
              <div className="text-xs font-medium text-slate-500">{dict.hero.stat2Caption}</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs text-center transition-transform hover:-translate-y-0.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
              variant="blue"
            />
            <div className="relative z-10">
              <div className="font-display text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
                {dict.hero.stat3Value}
              </div>
              <div className="text-xs font-medium text-slate-500">{dict.hero.stat3Caption}</div>
            </div>
          </div>
        </motion.div>

        {/* Digital Application Callout Card */}
        <motion.div
          variants={textItem}
          className="max-w-2xl mx-auto bg-white border border-brand-200/90 rounded-2xl p-3 sm:p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-left hover:border-brand-500/60 transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-navy-900">
                  {dict.hero.calloutTitle}
                </span>
                <Badge variant="green" className="text-[10px] py-0 px-2 font-bold">
                  {dict.hero.calloutBadge}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {dict.hero.calloutDescription}
              </p>
            </div>
          </div>

          <Button
            onClick={onOpenSolicitud}
            className="w-full sm:w-auto shrink-0 font-semibold gap-2 shadow-xs cursor-pointer"
          >
            <span>{dict.hero.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
