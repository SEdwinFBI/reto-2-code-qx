"use client";

import { useState, type FormEvent } from "react";
import { FormInput } from "@/components/ui";
import { Button } from "@/components/ui";
import { useAdminAuth } from "../hooks/useAdminAuth";

export function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login, isSubmitting, error } = useAdminAuth();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    login(usuario, password);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <h1 className="text-xl font-semibold">Panel de revisión — Tránsito PNC</h1>
      <FormInput
        label="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        autoComplete="username"
        required
      />
      <FormInput
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
