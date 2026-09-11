"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as adminAuthService from "../services/adminAuthService";

export function useAdminAuth() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(usuario: string, password: string) {
    setIsSubmitting(true);
    setError(null);
    try {
      await adminAuthService.login(usuario, password);
      router.push("/admin/solicitudes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    await adminAuthService.logout();
    router.push("/admin/login");
    router.refresh();
  }

  return { login, logout, isSubmitting, error };
}
