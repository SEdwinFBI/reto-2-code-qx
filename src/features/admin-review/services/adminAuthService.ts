import { readErrorMessage } from "@/lib/http";

export async function login(usuario: string, password: string): Promise<void> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "No se pudo iniciar sesión."));
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}
