import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Shield, Bot, Loader2, Volume2, VolumeX } from "lucide-react";
import { ChatMessage } from "../types";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

/**
 * The agent replies using WhatsApp-style single-asterisk emphasis (*texto*) to mean
 * bold, not the italic that CommonMark assigns to it. Upgrading lone *..* runs to
 * **..** lets remark render them as <strong>, matching what the agent intends.
 * Left untouched if the text already uses real **bold** markers.
 */
function normalizeAgentMarkdown(text: string): string {
  return text.replace(/(^|[^*])\*(?!\*)([^*\n]+?)\*(?!\*)/g, "$1**$2**");
}

/**
 * The Bedrock agent occasionally leaks raw tool-call control tokens into the
 * visible reply text. Strip known artifacts here so they never reach the user.
 */
const ARTIFACT_PATTERNS = ["<｜DSML｜function_calls"];

function stripKnownArtifacts(text: string): string {
  return ARTIFACT_PATTERNS.reduce((acc, pattern) => acc.split(pattern).join(""), text);
}

/** Reduces the agent's markdown reply to plain, speakable text for the "listen" button. */
function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\*\*?([^*\n]+?)\*\*?/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "enlace")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

interface MarkdownBoundaryState {
  hasError: boolean;
}

// Streamed, partially-formed markdown should never take the chat down — if parsing
// ever throws, fall back to the raw text so the reply still reaches the user.
class MarkdownBoundary extends React.Component<
  { fallback: string; children: React.ReactNode },
  MarkdownBoundaryState
> {
  state: MarkdownBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MarkdownBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="whitespace-pre-wrap break-words">{this.props.fallback}</div>;
    }
    return this.props.children;
  }
}

function buildMarkdownComponents(isUser: boolean): Components {
  const linkClass = isUser
    ? "underline decoration-blue-200 text-blue-50 hover:text-white break-all"
    : "underline decoration-brand-300 text-brand-600 hover:text-brand-700 break-all";

  return {
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => (
      <ul className="mb-2 last:mb-0 list-disc space-y-1 pl-4 marker:text-current/50">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-2 last:mb-0 list-decimal space-y-1 pl-4 marker:font-semibold marker:text-current/70">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn("font-medium", linkClass)}>
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="break-all rounded bg-black/5 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
    ),
    hr: () => <hr className="my-2 border-current/10" />,
  };
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const displayText = isUser ? message.text : stripKnownArtifacts(message.text);
  const isEmptyStreamingPlaceholder = displayText.length === 0 && message.isStreaming;
  const { speak, stop, isSpeaking, isSupported: canSpeak } = useSpeechSynthesis();
  const canReadAloud = !isUser && !isEmptyStreamingPlaceholder && !message.isStreaming && canSpeak;

  const handleToggleSpeak = () => {
    if (isSpeaking) stop();
    else speak(stripMarkdownForSpeech(displayText));
  };

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2.5 my-2.5 animate-in fade-in-50 duration-200",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100 text-brand-600">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-xs transition-all",
          isUser
            ? "bg-brand-600 text-white rounded-br-xs font-normal"
            : "bg-brand-50 text-slate-800 rounded-bl-xs border border-brand-100/60"
        )}
      >
        {isEmptyStreamingPlaceholder ? (
          <div className="flex items-center gap-2 text-slate-500 py-1">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            <span className="text-xs">Consultando base legal...</span>
          </div>
        ) : isUser ? (
          <div className="whitespace-pre-wrap break-words">{displayText}</div>
        ) : (
          <MarkdownBoundary fallback={displayText}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={buildMarkdownComponents(isUser)}
            >
              {normalizeAgentMarkdown(displayText)}
            </ReactMarkdown>
          </MarkdownBoundary>
        )}

        {message.isStreaming && displayText.length > 0 && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-current/70 animate-pulse align-middle" />
        )}

        <div
          className={cn(
            "flex items-center mt-1 gap-1.5",
            isUser ? "justify-end" : "justify-between"
          )}
        >
          {canReadAloud && (
            <button
              type="button"
              onClick={handleToggleSpeak}
              title={isSpeaking ? "Detener lectura" : "Escuchar respuesta"}
              aria-label={isSpeaking ? "Detener lectura" : "Escuchar respuesta"}
              className="p-1 -ml-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-brand-100/60 transition-colors cursor-pointer"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <div className={cn("text-[10px]", isUser ? "text-blue-200" : "text-slate-400")}>
            {message.timestamp}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center shrink-0 border border-gold-500/40 text-gold-100">
          <Shield className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};
