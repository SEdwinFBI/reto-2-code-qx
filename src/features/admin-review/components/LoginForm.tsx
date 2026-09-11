"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button, Card, FormInput } from "@/components/ui";
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
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3.5">
        <div className="flex h-15 w-15 items-center justify-center rounded-2xl border border-gold-500/50 bg-navy-900 shadow-lg shadow-navy-950/35">
          <ShieldCheck className="h-7 w-7 text-gold-500" />
        </div>
        <div className="text-center">
          <div className="font-display text-xl font-bold tracking-wide text-navy-900">
            PNC Tránsito
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Gestor de Solicitudes de Exoneración
          </div>
        </div>
      </div>

      <Card className="w-full p-7.5 shadow-2xl shadow-navy-950/15">
        <div className="mb-5">
          <h1 className="font-display text-lg font-semibold text-foreground">
            Panel de revisión
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ingresa tus credenciales institucionales para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <Button type="submit" disabled={isSubmitting} className="mt-1 gap-2">
            {isSubmitting ? "Ingresando…" : "Ingresar"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
      </Card>

      <p className="max-w-80 text-center text-[11px] leading-relaxed text-muted-foreground">
        Acceso restringido a personal autorizado de la División de Tránsito, PNC — Acuerdo
        Gubernativo 59-2012.
      </p>
    </div>
  );
}
