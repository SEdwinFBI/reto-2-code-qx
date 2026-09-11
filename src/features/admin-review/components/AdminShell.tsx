"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-collapsed";

export function AdminShell({ children }: { children: ReactNode }) {
  // Siempre inicia en false para que coincida con el HTML renderizado por el servidor
  // (localStorage no existe en SSR) y evitar un hydration mismatch. El valor persistido
  // se aplica después del montaje, en el cliente.
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única post-montaje para evitar hydration mismatch
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
    } catch {
      // localStorage no disponible (ej. modo privado) — se queda en el valor por defecto.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
    } catch {
      // localStorage no disponible (ej. modo privado) — el colapso simplemente no persiste.
    }
  }, [collapsed, hydrated]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-x-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
