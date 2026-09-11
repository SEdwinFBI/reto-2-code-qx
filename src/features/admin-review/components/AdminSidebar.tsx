"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof FileText;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Solicitudes", href: "/admin/solicitudes", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-navy-800 bg-navy-950 text-navy-200">
      <div className="flex items-center gap-3 border-b border-navy-800 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-500/60 bg-navy-900">
          <ShieldCheck className="h-5 w-5 text-gold-500" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-semibold tracking-wide text-white uppercase">
            PNC Tránsito
          </span>
          <span className="truncate text-[11px] text-navy-200/80">Gestor de Solicitudes</span>
          <span className="mt-0.5 inline-block w-fit rounded bg-navy-900 px-1.5 py-0.5 font-mono text-[9px] text-gold-500/90">
            AG 59-2012
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-navy-200 hover:bg-navy-900 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mt-auto mb-4 rounded-lg border border-navy-800 bg-navy-900/80 p-3">
        <p className="text-[11px] leading-relaxed text-navy-200/80">
          Exoneración sujeta a comprobantes fidedignos de fuerza mayor en el plazo estipulado.
        </p>
      </div>
    </aside>
  );
}
