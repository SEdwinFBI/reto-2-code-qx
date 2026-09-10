"use client";

import React from "react";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-white py-10 border-t border-navy-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Brand Info */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-navy-950 border border-gold-500/50 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Shield className="w-6 h-6 text-gold-100" />
            </div>
            <div>
              <h5 className="font-display text-sm font-bold text-white tracking-tight">
                Departamento de Tránsito de la Policía Nacional Civil
              </h5>
              <p className="text-xs text-blue-200/70 mt-0.5">
                República de Guatemala · Marco normativo Acuerdo Gubernativo 59-2012
              </p>
            </div>
          </div>

          {/* Right Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gold-100 tracking-wide bg-navy-950/80 px-3 py-1.5 rounded-full border border-gold-500/30">
              Trámite Oficial Gratuito
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
