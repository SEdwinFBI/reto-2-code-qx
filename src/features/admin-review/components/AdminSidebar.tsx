"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof FileText;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Solicitudes", href: "/admin/solicitudes", icon: FileText },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-slate-100 px-4 py-4",
          collapsed && "flex-col gap-2 px-2 py-3"
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-full border-2 border-gold-500/70 shadow-sm transition-[height,width] duration-200",
            collapsed ? "h-9 w-9" : "h-10 w-10"
          )}
        >
          <Image
            src="/images.jpg"
            alt="Escudo Nacional de Guatemala"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div
          className={cn(
            "grid min-w-0 flex-1 grid-cols-[1fr_auto] items-center gap-2 overflow-hidden transition-[grid-template-columns,opacity] duration-200",
            collapsed && "grid-cols-[0fr_auto] opacity-0"
          )}
        >
          <div className="min-w-0 overflow-hidden">
            <span className="block truncate font-display text-sm font-semibold tracking-wide text-navy-900">
              PNC Tránsito
            </span>
            <span className="block truncate text-[11px] text-slate-500">
              Gestor de Solicitudes
            </span>
            <span className="mt-0.5 inline-block w-fit rounded bg-gold-50 px-1.5 py-0.5 font-mono text-[9px] whitespace-nowrap text-gold-800">
              AG 59-2012
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-900",
            !collapsed && "-ml-1"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className={cn("flex flex-col gap-1 px-3 py-4", collapsed && "items-center px-2")}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2.5",
                isActive
                  ? "bg-brand-600 text-white shadow-sm before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-gold-500"
                  : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                  collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mx-3 mt-auto mb-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Exoneración sujeta a comprobantes fidedignos de fuerza mayor en el plazo estipulado.
          </p>
        </div>
      )}
    </aside>
  );
}
