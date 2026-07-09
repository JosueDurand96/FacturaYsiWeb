"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Send } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { DocumentoT } from "@/lib/types";
import { MOTIVOS, UNIDADES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { UbigeoSelect } from "@/components/app/UbigeoSelect";

interface Item {
  descripcion: string;
  cantidad: string;
  unidadMedida: string;
}

export default function EmitirGrePage() {
  const router = useRouter();
  const [cli, setCli] = useState({ numeroDoc: "", denominacion: "", direccion: "" });
  const [items, setItems] = useState<Item[]>([{ descripcion: "", cantidad: "1", unidadMedida: "NIU" }]);
  const [peso, setPeso] = useState("0");
  const [bultos, setBultos] = useState("0");
  const [partida, setPartida] = useState({ ubigeo: "", direccion: "" });
  const [llegada, setLlegada] = useState({ ubigeo: "", direccion: "" });
  const [motivo, setMotivo] = useState("01");
  const [modalidad, setModalidad] = useState("02");
  const [placa, setPlaca] = useState("");
  const [mtc, setMtc] = useState("");
  const [cond, setCond] = useState({ numeroDoc: "", nombres: "", apellidos: "", numeroLicencia: "" });
  const [obs, setObs] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const emitir = async () => {
    setError("");
    if (!cli.numeroDoc || !cli.denominacion) return setError("Completa el destinatario");
    if (!partida.ubigeo || !partida.direccion) return setError("Completa el punto de partida");
    if (!llegada.ubigeo || !llegada.direccion) return setError("Completa el punto de llegada");
    if (!placa) return setError("Ingresa la placa del vehículo");
    if (!cond.numeroDoc || !cond.nombres) return setError("Completa el conductor");

    const payload = {
      cliente: { tipoDoc: "6", ...cli },
      motivoTraslado: motivo,
      modalidadTraslado: modalidad,
      fechaInicioTraslado: new Date().toISOString().slice(0, 10),
      puntoPartida: partida,
      puntoLlegada: llegada,
      pesoBrutoTotal: Number(peso) || 0,
      pesoBrutoUnidadMedida: "KGM",
      numeroBultos: Number(bultos) || 0,
      vehiculos: [{ placa: placa.toUpperCase(), autorizacionMTC: mtc, esPrincipal: true }],
      conductores: [{ tipoDoc: "1", ...cond, esPrincipal: true }],
      observaciones: obs,
      items: items.map((i) => ({
        descripcion: i.descripcion,
        cantidad: Number(i.cantidad) || 1,
        unidadMedida: i.unidadMedida,
      })),
    };

    setLoading(true);
    try {
      const doc = await unwrap<DocumentoT>(api.post("/documentos/gre-remitente", payload));
      router.push(`/app/documento/${doc._id}?nuevo=1`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-content">Nueva Guía de Remisión</h1>
      <p className="text-sm text-muted">Solo llena y emite.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Destinatario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>RUC / Documento</Label>
                <Input value={cli.numeroDoc} onChange={(e) => setCli({ ...cli, numeroDoc: e.target.value })} />
              </div>
              <div>
                <Label>Denominación</Label>
                <Input value={cli.denominacion} onChange={(e) => setCli({ ...cli, denominacion: e.target.value })} />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input value={cli.direccion} onChange={(e) => setCli({ ...cli, direccion: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bienes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((it, i) => (
                <div key={i} className="rounded-xl bg-elevated p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted">Bien {i + 1}</span>
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
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Cantidad"
                      value={it.cantidad}
                      onChange={(e) => setItem(i, { cantidad: e.target.value })}
                    />
                    <Select value={it.unidadMedida} onChange={(e) => setItem(i, { unidadMedida: e.target.value })}>
                      {UNIDADES.map((u) => (
                        <option key={u.codigo} value={u.codigo}>
                          {u.nombre}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setItems((a) => [...a, { descripcion: "", cantidad: "1", unidadMedida: "NIU" }])}
              >
                <Plus className="h-4 w-4" /> Agregar bien
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Peso bruto (KG)</Label>
                  <Input value={peso} onChange={(e) => setPeso(e.target.value)} />
                </div>
                <div>
                  <Label>N° bultos</Label>
                  <Input value={bultos} onChange={(e) => setBultos(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Traslado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Punto de partida</Label>
              <UbigeoSelect onChange={(u) => setPartida((p) => ({ ...p, ubigeo: u }))} />
              <Input
                placeholder="Dirección de partida"
                value={partida.direccion}
                onChange={(e) => setPartida({ ...partida, direccion: e.target.value })}
              />
              <Label className="pt-2">Punto de llegada</Label>
              <UbigeoSelect onChange={(u) => setLlegada((p) => ({ ...p, ubigeo: u }))} />
              <Input
                placeholder="Dirección de llegada"
                value={llegada.direccion}
                onChange={(e) => setLlegada({ ...llegada, direccion: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <Label>Motivo</Label>
                  <Select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                    {MOTIVOS.map((m) => (
                      <option key={m.codigo} value={m.codigo}>
                        {m.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Modalidad</Label>
                  <Select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                    <option value="02">Privado</option>
                    <option value="01">Público</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Placa</Label>
                  <Input value={placa} onChange={(e) => setPlaca(e.target.value)} maxLength={8} />
                </div>
                <div>
                  <Label>N° MTC (opcional)</Label>
                  <Input value={mtc} onChange={(e) => setMtc(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>DNI conductor</Label>
                <Input value={cond.numeroDoc} onChange={(e) => setCond({ ...cond, numeroDoc: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Nombres</Label>
                  <Input value={cond.nombres} onChange={(e) => setCond({ ...cond, nombres: e.target.value })} />
                </div>
                <div>
                  <Label>Apellidos</Label>
                  <Input value={cond.apellidos} onChange={(e) => setCond({ ...cond, apellidos: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>N° Licencia</Label>
                <Input value={cond.numeroLicencia} onChange={(e) => setCond({ ...cond, numeroLicencia: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea rows={3} value={obs} onChange={(e) => setObs(e.target.value)} />
            </CardContent>
          </Card>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      <div className="mt-6">
        <Button size="lg" className="w-full" onClick={emitir} disabled={loading}>
          <Send className="h-4 w-4" /> {loading ? "Enviando a SUNAT..." : "Emitir y enviar a SUNAT"}
        </Button>
      </div>
    </div>
  );
}
