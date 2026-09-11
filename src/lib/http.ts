/**
 * Lee el cuerpo de una Response fallida e intenta extraer un mensaje de error
 * legible, ya sea de un JSON `{error, details}` o de texto plano.
 * Patrón compartido por los servicios de features (agent-chat, solicitud, admin-review).
 */
export async function readErrorMessage(
  response: Response,
  fallback = "Ocurrió un error inesperado"
): Promise<string> {
  const rawText = await response.text().catch(() => "");
  if (!rawText) return fallback;

  try {
    const parsed = JSON.parse(rawText);
    return parsed.details || parsed.error || rawText;
  } catch {
    return rawText;
  }
}
