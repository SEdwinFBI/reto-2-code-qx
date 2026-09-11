// Extrae un mensaje de error legible desde una respuesta HTTP fallida.
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
