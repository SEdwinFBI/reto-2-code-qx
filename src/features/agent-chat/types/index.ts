export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface AgentApiRequest {
  message: string;
  sessionId: string;
}
