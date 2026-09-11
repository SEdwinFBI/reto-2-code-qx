export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET no está configurado");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * HMAC-SHA256 vía Web Crypto (SubtleCrypto), disponible tanto en Node.js
 * como en el Edge Runtime que usa middleware.ts — a diferencia del módulo
 * `crypto` de Node, que no corre en Edge.
 */
async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Sesión de administrador simulada para demo: credenciales fijas por env var
 * y cookie firmada con HMAC (sin librería de JWT ni almacén de sesión).
 * Explícitamente reemplazable por autenticación real más adelante.
 */
export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${expiry}`;
  const signature = await sign(payload);
  return `${payload}:${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [actor, expiryStr, signature] = parts;
  const expiry = Number(expiryStr);
  if (actor !== "admin" || Number.isNaN(expiry)) return false;
  if (Date.now() > expiry) return false;

  const expectedSignature = await sign(`${actor}:${expiryStr}`);
  return timingSafeEqual(expectedSignature, signature);
}

export function checkAdminCredentials(usuario: string, password: string): boolean {
  return (
    usuario === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
  );
}
