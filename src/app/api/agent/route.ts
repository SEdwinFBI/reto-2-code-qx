import { NextRequest, NextResponse } from "next/server";
import { invokeBedrockAgent } from "@/lib/bedrock-agent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es obligatorio y debe ser una cadena de texto." },
        { status: 400 }
      );
    }

    const safeSessionId =
      sessionId || `session-${Math.random().toString(36).substring(2, 10)}`;

    const stream = await invokeBedrockAgent({
      message,
      sessionId: safeSessionId,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: unknown) {
    console.error("Error in Bedrock agent route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json(
      {
        error: "Error procesando solicitud del asistente",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
