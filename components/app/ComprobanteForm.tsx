"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Send } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { DocumentoT } from "@/lib/types";
import { UNIDADES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

interface Item {
  descripcion: string;
  cantidad: string;
  valorUnitario: string;
  unidadMedida: string;
}

export function ComprobanteForm({ esFactura }: { esFactura: boolean }) {
  const router = useRouter();
  const [cli, setCli] = useState({
    numeroDoc: esFactura ? "" : "00000000",
    denominacion: esFactura ? "" : "CLIENTE VARIOS",
    direccion: "",
  });
  const [moneda, setMoneda] = useState("PEN");
  const [obs, setObs] = useState("");
  const [items, setItems] = useState<Item[]>([
    { descripcion: "", cantidad: "1", valorUnitario: "0", unidadMedida: "NIU" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const sub = items.reduce(
    (s, it) => s + (Number(it.valorUnitario) || 0) * (Number(it.cantidad) || 0),
    0
  );
  const igv = sub * 0.18;
  const total = sub + igv;
  const simbolo = moneda === "USD" ? "$" : "S/";

  const emitir = async () => {
    setError("");
    if (!cli.numeroDoc || !cli.denominacion) return setError("Completa los datos del cliente");
    if (items.every((i) => !i.descripcion)) return setError("Agrega al menos un ítem");

    const payload = {
      cliente: { tipoDoc: esFactura ? "6" : "1", ...cli },
      moneda,
      porcentajeIgv: 18,
      observaciones: obs,
      items: items.map((i) => ({
        descripcion: i.descripcion,
        cantidad: Number(i.cantidad) || 1,
        unidadMedida: i.unidadMedida,
        valorUnitario: Number(i.valorUnitario) || 0,
      })),
    };

    setLoading(true);
    try {
      const path = esFactura ? "/documentos/factura" : "/documentos/boleta";
      const doc = await unwrap<DocumentoT>(api.post(path, payload));
      router.push(`/app/documento/${doc._id}?nuevo=1`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-content">
        {esFactura ? "Nueva Factura" : "Nueva Boleta"}
      </h1>

      <div className="mt-6 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>{esFactura ? "Cliente (con RUC)" : "Cliente"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{esFactura ? "RUC" : "DNI"}</Label>
                <Input value={cli.numeroDoc} onChange={(e) => setCli({ ...cli, numeroDoc: e.target.value })} />
              </div>
              <div>
                <Label>Moneda</Label>
                <Select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                  <option value="PEN">Soles (PEN)</option>
                  <option value="USD">Dólares (USD)</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Denominación</Label>
              <Input value={cli.denominacion} onChange={(e) => setCli({ ...cli, denominacion: e.target.value })} />
            </div>
            <div>
              <Label>Dirección (opcional)</Label>
              <Input value={cli.direccion} onChange={(e) => setCli({ ...cli, direccion: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ítems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((it, i) => (
              <div key={i} className="rounded-xl bg-elevated p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted">Ítem {i + 1}</span>
                  {items.length > 1 && (
                    <button onClick={() => setItems((a) => a.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </button>
                  )}
                </div>
                <Input
                  className="mb-2"
                  placeholder="Descripción"
                  value={it.descripcion}
                  onChange={(e) => setItem(i, { descripcion: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Cant."
                    value={it.cantidad}
                    onChange={(e) => setItem(i, { cantidad: e.target.value })}
                  />
                  <Input
                    placeholder="Valor unit."
                    value={it.valorUnitario}
                    onChange={(e) => setItem(i, { valorUnitario: e.target.value })}
                  />
                  <Select value={it.unidadMedida} onChange={(e) => setItem(i, { unidadMedida: e.target.value })}>
                    {UNIDADES.map((u) => (
                      <option key={u.codigo} value={u.codigo}>
                        {u.codigo}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setItems((a) => [...a, { descripcion: "", cantidad: "1", valorUnitario: "0", unidadMedida: "NIU" }])
              }
            >
              <Plus className="h-4 w-4" /> Agregar ítem
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1 pt-5">
            <Row label="Op. gravada" value={`${simbolo} ${sub.toFixed(2)}`} />
            <Row label="IGV (18%)" value={`${simbolo} ${igv.toFixed(2)}`} />
            <div className="my-2 border-t border-line" />
            <Row label="Total" value={`${simbolo} ${total.toFixed(2)}`} bold />
          </CardContent>
        </Card>

        <div>
          <Label>Observaciones</Label>
          <Textarea rows={2} value={obs} onChange={(e) => setObs(e.target.value)} />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        <Button size="lg" className="w-full" onClick={emitir} disabled={loading}>
          <Send className="h-4 w-4" /> {loading ? "Enviando..." : "Emitir y enviar a SUNAT"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-lg font-bold text-content" : "text-sm text-muted"}>{label}</span>
      <span className={bold ? "text-lg font-bold text-brand-green" : "text-sm text-content"}>{value}</span>
    </div>
  );
}
