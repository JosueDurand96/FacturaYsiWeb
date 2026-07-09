"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, FileText, Code, RefreshCw, Ban } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { DocumentoT } from "@/lib/types";
import { serieNumero, TIPO_LABEL, ESTADO_LABEL, formatMoney } from "@/lib/utils";
import { EstadoBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DocumentoDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const search = useSearchParams();
  const nuevo = search.get("nuevo") === "1";
  const qc = useQueryClient();

  const { data: doc, isLoading } = useQuery({
    queryKey: ["documento", id],
    queryFn: () => unwrap<DocumentoT>(api.get(`/documentos/${id}`)),
  });

  const consultar = useMutation({
    mutationFn: () => unwrap(api.get(`/documentos/${id}/consultar`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documento", id] }),
  });
  const anular = useMutation({
    mutationFn: () => unwrap(api.post(`/documentos/${id}/anular`, { motivo: "ERROR EN LA EMISION" })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documento", id] }),
  });

  if (isLoading || !doc) {
    return <div className="p-6 text-muted">Cargando...</div>;
  }

  const esGuia = doc.tipo.startsWith("GRE");
  const gre = doc.gre as
    | { puntoPartida?: { direccion?: string }; puntoLlegada?: { direccion?: string }; pesoBrutoTotal?: number }
    | undefined;

  return (
    <div className="mx-auto max-w-3xl p-6">
      {nuevo && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-success/40 bg-success/10 px-5 py-4">
          <CheckCircle2 className="h-6 w-6 text-success" />
          <div>
            <p className="font-semibold text-content">¡Documento emitido!</p>
            <p className="text-sm text-muted">Enviado a SUNAT vía Nubefact.</p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content">{serieNumero(doc.serie, doc.numero)}</h1>
          <p className="text-muted">{TIPO_LABEL[doc.tipo]}</p>
        </div>
        <EstadoBadge estado={doc.estado} />
      </div>

      {doc.qrCode && (
        <div className="mt-5 rounded-xl border border-line bg-panel p-4">
          <p className="mb-1 text-xs text-muted">Cadena QR</p>
          <p className="break-all font-mono text-xs text-content">{doc.qrCode}</p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <Row k="Denominación" v={doc.cliente.denominacion} />
            <Row k="Documento" v={doc.cliente.numeroDoc} />
            {doc.cliente.direccion && <Row k="Dirección" v={doc.cliente.direccion} />}
          </CardContent>
        </Card>

        {esGuia && gre && (
          <Card>
            <CardHeader>
              <CardTitle>Traslado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <Row k="Partida" v={gre.puntoPartida?.direccion ?? "—"} />
              <Row k="Llegada" v={gre.puntoLlegada?.direccion ?? "—"} />
              <Row k="Peso" v={`${gre.pesoBrutoTotal ?? 0} KG`} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Detalle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {doc.items.map((it, i) => (
              <Row key={i} k={`${it.cantidad} ${it.unidadMedida}`} v={it.descripcion} />
            ))}
            {!esGuia && <Row k="Total" v={formatMoney(doc.total, doc.moneda === "USD" ? "$" : "S/")} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SUNAT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <Row k="Estado" v={ESTADO_LABEL[doc.estado] ?? doc.estado} />
            {doc.mensajeSunat && <Row k="Mensaje" v={doc.mensajeSunat} />}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {doc.enlacePdf && (
          <a href={doc.enlacePdf} target="_blank" rel="noreferrer">
            <Button>
              <FileText className="h-4 w-4" /> Ver PDF
            </Button>
          </a>
        )}
        {doc.enlaceXml && (
          <a href={doc.enlaceXml} target="_blank" rel="noreferrer">
            <Button variant="outline">
              <Code className="h-4 w-4" /> XML
            </Button>
          </a>
        )}
        <Button variant="outline" onClick={() => consultar.mutate()} disabled={consultar.isPending}>
          <RefreshCw className="h-4 w-4" /> Consultar
        </Button>
        {doc.estado === "ACEPTADO_SUNAT" && (
          <Button variant="danger" onClick={() => anular.mutate()} disabled={anular.isPending}>
            <Ban className="h-4 w-4" /> Anular
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 shrink-0 text-muted">{k}</span>
      <span className="text-content">{v}</span>
    </div>
  );
}
