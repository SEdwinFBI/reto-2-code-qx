import { BedrockAgentCoreClient, InvokeHarnessCommand } from "@aws-sdk/client-bedrock-agentcore";


const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || "us-east-1";
const accessKeyId = process.env.ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

export const bedrockClient = new BedrockAgentCoreClient({
  region,
  ...(accessKeyId && secretAccessKey
    ? {
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      }
    : {}),
});

export const DEFAULT_HARNESS_ARN =
  process.env.BEDROCK_HARNESS_ARN ||
  "arn:aws:bedrock-agentcore:us-east-1:529088301157:harness/agente_prueba-8ve3uTOtT0";

export interface AgentChatMessage {
  role: "user" | "assistant";
  text: string;
}

function sanitizeSessionId(sessionId?: string): string {
  if (sessionId && sessionId.length >= 33) {
    return sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
  }
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let res = (sessionId ? sessionId.replace(/[^a-zA-Z0-9_-]/g, "") + "_" : "session_");
  while (res.length < 36) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export async function invokeBedrockAgent({
  message,
  sessionId,
  harnessArn = DEFAULT_HARNESS_ARN,
}: {
  message: string;
  sessionId: string;
  harnessArn?: string;
}): Promise<ReadableStream<Uint8Array>> {
  const validSessionId = sanitizeSessionId(sessionId);
  const command = new InvokeHarnessCommand({
    harnessArn,
    runtimeSessionId: validSessionId,
    messages: [
      {
        role: "user",
        content: [{ text: message }],
      },
    ],
  });

  const response = await bedrockClient.send(command);

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (response.stream) {
          for await (const event of response.stream) {
            if (event.contentBlockDelta?.delta?.text) {
              controller.enqueue(encoder.encode(event.contentBlockDelta.delta.text));
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
