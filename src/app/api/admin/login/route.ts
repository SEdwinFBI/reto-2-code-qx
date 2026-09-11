import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  checkAdminCredentials,
  createSessionToken,
} from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const usuario = body?.usuario as string | undefined;
  const password = body?.password as string | undefined;

  if (!usuario || !password) {
    return NextResponse.json(
      { error: "Usuario y contraseña son obligatorios." },
      { status: 400 }
    );
  }

  if (!checkAdminCredentials(usuario, password)) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}
