"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Truck, Receipt, FileText, ChevronRight } from "lucide-react";
import { api, unwrapWithMeta } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { DocumentoT } from "@/lib/types";
import { EstadoBadge } from "@/components/ui/badge";
import { serieNumero, TIPO_LABEL } from "@/lib/utils";

const cards = [
  {
    href: "/app/emitir/gre",
    icon: Truck,
    color: "text-brand-green bg-brand-green/15",
    title: "Guía de Remisión",
    subtitle: "Traslado de carga",
    border: "border-brand-green/40",
  },
  {
    href: "/app/emitir/boleta",
    icon: Receipt,
    color: "text-info bg-info/15",
    title: "Boleta",
    subtitle: "Venta a consumidor final",
    border: "border-line",
  },
  {
    href: "/app/emitir/factura",
    icon: FileText,
    color: "text-success bg-success/15",
    title: "Factura",
    subtitle: "Venta con RUC",
    border: "border-line",
  },
];

export default function AppDashboard() {
  const { user, empresa } = useAuth();
  const recientes = useQuery({
    queryKey: ["recientes"],
    queryFn: () =>
      unwrapWithMeta<DocumentoT[]>(api.get("/documentos", { params: { limit: 5 } })),
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      <p className="text-sm text-muted">Hola, {user?.nombres}</p>
      <h1 className="text-2xl font-bold text-content">{empresa?.razonSocial}</h1>

      <h2 className="mt-8 text-lg font-semibold text-content">¿Qué deseas emitir?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`rounded-2xl border ${c.border} bg-panel p-5 transition-colors hover:bg-elevated`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-content">{c.title}</h3>
            <p className="text-sm text-muted">{c.subtitle}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-content">Recientes</h2>
        <Link href="/app/historial" className="text-sm text-brand-green">
          Ver todo
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {recientes.data?.data.map((d) => (
          <Link
            key={d._id}
            href={`/app/documento/${d._id}`}
            className="flex items-center gap-4 rounded-xl border border-line bg-panel px-4 py-3 hover:bg-elevated"
          >
            <div className="flex-1">
              <p className="font-medium text-content">{serieNumero(d.serie, d.numero)}</p>
              <p className="text-xs text-muted">
                {TIPO_LABEL[d.tipo]} · {d.cliente.denominacion}
              </p>
            </div>
            <EstadoBadge estado={d.estado} />
            <ChevronRight className="h-4 w-4 text-muted" />
          </Link>
        ))}
        {recientes.data && recientes.data.data.length === 0 && (
          <p className="text-sm text-muted">Aún no has emitido documentos.</p>
        )}
      </div>
    </div>
  );
}
