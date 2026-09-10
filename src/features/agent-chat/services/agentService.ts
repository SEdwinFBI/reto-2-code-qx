import { AgentApiRequest } from "../types";

async function readErrorMessage(response: Response): Promise<string> {
  const rawText = await response.text().catch(() => "");
  if (!rawText) return "Error al comunicarse con el asistente";

  try {
    const parsed = JSON.parse(rawText);
    return parsed.details || parsed.error || rawText;
  } catch {
    return rawText;
  }
}

export async function sendMessageToAgent(
  payload: AgentApiRequest,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  // Handle streaming response if available
  if (response.body && onChunk) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (text) {
          accumulated += text;
          onChunk(text);
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!accumulated.trim()) {
      throw new Error("El asistente no devolvió una respuesta. Intenta de nuevo.");
    }

    return accumulated;
  }

  // Fallback to text
  return await response.text();
}
