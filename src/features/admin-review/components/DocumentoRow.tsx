import { ExternalLink, FileCheck2, FileSignature, IdCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export type DocumentoCategoria = "DPI" | "COMPROBANTE" | "AUTORIZACION" | "RESOLUCION";

interface DocumentoRowProps {
  categoria: DocumentoCategoria;
  label: string;
  url: string;
  originalName: string;
}

const CATEGORIA_CONFIG: Record<
  DocumentoCategoria,
  { icon: typeof IdCard; className: string }
> = {
  DPI: { icon: IdCard, className: "bg-brand-50 text-brand-600 border-brand-100" },
  COMPROBANTE: { icon: Receipt, className: "bg-gold-50 text-gold-800 border-gold-200/60" },
  AUTORIZACION: {
    icon: FileSignature,
    className: "bg-violet-500/10 text-violet-600 border-violet-200/60",
  },
  RESOLUCION: {
    icon: FileCheck2,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60",
  },
};

export function DocumentoRow({ categoria, label, url, originalName }: DocumentoRowProps) {
  const { icon: Icon, className } = CATEGORIA_CONFIG[categoria];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", className)}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-navy-900">{label}</span>
        <span className="truncate text-xs text-slate-500">{originalName}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 gap-1.5"
        nativeButton={false}
        render={<a href={url} target="_blank" rel="noopener noreferrer" />}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Abrir
      </Button>
    </div>
  );
}
