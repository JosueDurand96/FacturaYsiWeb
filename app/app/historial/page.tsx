"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api, unwrapWithMeta } from "@/lib/api";
import type { DocumentoT } from "@/lib/types";
import { serieNumero, TIPO_LABEL, formatMoney } from "@/lib/utils";
import { EstadoBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { format } from "date-fns";

export default function HistorialPage() {
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["historial", tipo, estado, q],
    queryFn: () =>
      unwrapWithMeta<DocumentoT[]>(
        api.get("/documentos", {
          params: {
            tipo: tipo || undefined,
            estado: estado || undefined,
            q: q || undefined,
            limit: 50,
          },
        })
      ),
  });

  const rows = data?.data ?? [];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-content">Historial</h1>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Buscar cliente o serie"
            onKeyDown={(e) => e.key === "Enter" && setQ((e.target as HTMLInputElement).value)}
          />
        </div>
        <Select className="w-auto" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todo tipo</option>
          <option value="GRE_REMITENTE">Guías</option>
          <option value="FACTURA">Facturas</option>
          <option value="BOLETA">Boletas</option>
        </Select>
        <Select className="w-auto" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todo estado</option>
          <option value="ACEPTADO_SUNAT">Aceptado</option>
          <option value="PENDIENTE">En proceso</option>
          <option value="RECHAZADO_SUNAT">Rechazado</option>
        </Select>
      </div>

      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-line/60">
                <th className="px-4 py-3 font-medium">Serie-Nro</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    Cargando...
                  </td>
                </tr>
              )}
              {rows.map((d) => (
                <tr key={d._id} className="border-b border-line/40 hover:bg-elevated/50">
                  <td className="px-4 py-3">
                    <Link href={`/app/documento/${d._id}`} className="font-medium text-content hover:text-brand-green">
                      {serieNumero(d.serie, d.numero)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{TIPO_LABEL[d.tipo]}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-content">{d.cliente.denominacion}</td>
                  <td className="px-4 py-3 text-right text-content">
                    {d.tipo.startsWith("GRE") ? "—" : formatMoney(d.total)}
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={d.estado} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {format(new Date(d.fechaEmision), "dd/MM/yyyy")}
                  </td>
                </tr>
              ))}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    Sin documentos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
