"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAdminAuth } from "../hooks/useAdminAuth";

export function AdminTopbar({ title = "Solicitudes" }: { title?: string }) {
  const { logout } = useAdminAuth();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="font-display text-lg font-semibold text-foreground">{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Oficial Revisor</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
