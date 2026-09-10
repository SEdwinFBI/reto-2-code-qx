import React from "react";
import { Clock, Users, MapPin, FileCheck } from "lucide-react";

interface ChatSuggestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  {
    icon: Clock,
    label: "¿Cuánto tarda?",
    prompt: "¿Cuánto tiempo tarda la resolución del trámite?",
  },
  {
    icon: Users,
    label: "¿Familiar?",
    prompt: "¿Puede un familiar llevar mis papeles si no puedo viajar a la capital?",
  },
  {
    icon: MapPin,
    label: "Sede Central",
    prompt: "¿Dónde queda la ventanilla de Asuntos Jurídicos y cuáles son sus horarios?",
  },
  {
    icon: FileCheck,
    label: "Requisitos",
    prompt: "¿Cuáles son los 3 documentos obligatorios para solicitar la exoneración?",
  },
];

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 no-scrollbar">
      {SUGGESTIONS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/90 text-slate-700 hover:bg-brand-50 hover:text-brand-600 border border-slate-200/70 shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Icon className="w-3.5 h-3.5 text-slate-500" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
