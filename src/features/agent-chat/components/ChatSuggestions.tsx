import React from "react";
import { PlusCircle, Plane, Lock, FileCheck } from "lucide-react";

interface ChatSuggestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

// Mirrors the 3 causales from CausalesSection so the quick actions match what the
// visitor is already looking at on screen, instead of generic FAQ-style prompts.
const SUGGESTIONS = [
  {
    icon: PlusCircle,
    label: "Tuve una enfermedad",
    prompt: "Tuve una enfermedad o accidente y no pude renovar mi licencia a tiempo, ¿califico para la exoneración?",
  },
  {
    icon: Plane,
    label: "Estuve fuera del país",
    prompt: "Estuve fuera del país cuando venció mi licencia, ¿qué documentos necesito para la exoneración?",
  },
  {
    icon: Lock,
    label: "Estuve privado de libertad",
    prompt: "Estuve privado de libertad cuando venció mi licencia, ¿aplico para la exoneración?",
  },
  {
    icon: FileCheck,
    label: "¿Cómo empiezo?",
    prompt: "¿Cuáles son los pasos y documentos para solicitar la exoneración?",
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
