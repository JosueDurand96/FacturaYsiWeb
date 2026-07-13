"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Send, Search, Link2, X } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import { useAuth } from "@/lib/auth";
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

interface DocRelacionado {
  tipo: string;
  serie: string;
  numero: string;
  rucEmisor: string;
}

type TipoGre = "GRE_REMITENTE" | "GRE_TRANSPORTISTA";
type PagadorTipo = "REMITENTE" | "SUBCONTRATADOR" | "OTRO";

export default function EmitirGrePage() {
  const router = useRouter();
  const empresa = useAuth((s) => s.empresa);

  // Form state
  const [tipoGre, setTipoGre] = useState<TipoGre>("GRE_REMITENTE");
  const [cli, setCli] = useState({ numeroDoc: "", denominacion: "", direccion: "" });
  const [items, setItems] = useState<Item[]>([{ descripcion: "", cantidad: "1", unidadMedida: "NIU" }]);
  const [peso, setPeso] = useState("0");
  const [bultos, setBultos] = useState("0");
  const [partida, setPartida] = useState({ ubigeo: "", direccion: "" });
  const [llegada, setLlegada] = useState({ ubigeo: "", direccion: "" });
  const [motivo, setMotivo] = useState("01");
  const [modalidad, setModalidad] = useState("02");
  const [transbordoProgramado, setTransbordoProgramado] = useState(false);
  const [placa, setPlaca] = useState("");
  const [mtc, setMtc] = useState("");
  const [cond, setCond] = useState({ numeroDoc: "", nombres: "", apellidos: "", numeroLicencia: "" });
  const [obs, setObs] = useState("");

  // v3 fields
  const [docsRelacionados, setDocsRelacionados] = useState<DocRelacionado[]>([]);
  const [linkedDocs, setLinkedDocs] = useState<DocumentoT[]>([]);
  const [docRelSerie, setDocRelSerie] = useState("");
  const [docRelNumero, setDocRelNumero] = useState("");
  const [searchingDoc, setSearchingDoc] = useState(false);
  const [pagadorTipo, setPagadorTipo] = useState<PagadorTipo>("REMITENTE");
  const [pagadorDoc, setPagadorDoc] = useState("");
  const [pagadorDenom, setPagadorDenom] = useState("");
  const [retornoConEnvases, setRetornoConEnvases] = useState(false);
  const [retornoVehiculoVacio, setRetornoVehiculoVacio] = useState(false);
  const [transporteSubcontratado, setTransporteSubcontratado] = useState(false);
  const [subcontDoc, setSubcontDoc] = useState("");
  const [subcontDenom, setSubcontDenom] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const esTransportista = tipoGre === "GRE_TRANSPORTISTA";
  const hasLinkedDocs = linkedDocs.length > 0;
  const serie = esTransportista
    ? (empresa?.serieGRETransportista ?? "V001")
    : (empresa?.serieGRERemitente ?? "T001");

  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const buscarDocRelacionado = async () => {
    if (!docRelSerie || !docRelNumero) return;
    setSearchingDoc(true);
    try {
      const doc = await unwrap<DocumentoT>(
        api.get("/documentos/buscar", {
          params: { tipo: "GRE_REMITENTE", serie: docRelSerie.toUpperCase(), numero: docRelNumero },
        })
      );
      setDocsRelacionados((prev) => [
        ...prev,
        {
          tipo: "09",
          serie: doc.serie,
          numero: String(doc.numero),
          rucEmisor: (doc.gre?.remitente as Record<string, string>)?.numeroDoc ?? empresa?.ruc ?? "",
        },
      ]);
      setLinkedDocs((prev) => [...prev, doc]);
      importFromDoc(doc);
      setDocRelSerie("");
      setDocRelNumero("");
    } catch {
      setError("Documento no encontrado");
    } finally {
      setSearchingDoc(false);
    }
  };

  const importFromDoc = (doc: DocumentoT) => {
    setCli({ numeroDoc: doc.cliente.numeroDoc, denominacion: doc.cliente.denominacion, direccion: doc.cliente.direccion ?? "" });
    const gre = doc.gre;
    if (gre) {
      const pp = gre.puntoPartida as Record<string, string> | undefined;
      const pl = gre.puntoLlegada as Record<string, string> | undefined;
      if (pp) setPartida({ ubigeo: pp.ubigeo ?? "", direccion: pp.direccion ?? "" });
      if (pl) setLlegada({ ubigeo: pl.ubigeo ?? "", direccion: pl.direccion ?? "" });
      setMotivo((gre.motivoTraslado as string) ?? "01");
      setTransbordoProgramado(gre.transbordoProgramado === true);
      setPeso(String(gre.pesoBrutoTotal ?? "0"));
      setBultos(String(gre.numeroBultos ?? "0"));
    }
    if (doc.items.length > 0) {
      setItems(doc.items.map((it) => ({ descripcion: it.descripcion, cantidad: String(it.cantidad), unidadMedida: it.unidadMedida })));
    }
  };

  const removeDocRel = (i: number) => {
    setDocsRelacionados((prev) => prev.filter((_, idx) => idx !== i));
    setLinkedDocs((prev) => prev.filter((_, idx) => idx !== i));
  };

  const emitir = async () => {
    setError("");
    if (!cli.numeroDoc || !cli.denominacion) return setError("Completa el destinatario");
    if (!partida.ubigeo || !partida.direccion) return setError("Completa el punto de partida");
    if (!llegada.ubigeo || !llegada.direccion) return setError("Completa el punto de llegada");
    if (!placa) return setError("Ingresa la placa del vehículo");
    if (!cond.numeroDoc || !cond.nombres) return setError("Completa el conductor");
    if (esTransportista && docsRelacionados.length === 0) return setError("Agrega al menos un documento relacionado");

    const payload: Record<string, unknown> = {
      cliente: { tipoDoc: "6", ...cli },
      motivoTraslado: motivo,
      modalidadTraslado: esTransportista ? "02" : modalidad,
      fechaInicioTraslado: new Date().toISOString().slice(0, 10),
      puntoPartida: partida,
      puntoLlegada: llegada,
      transbordoProgramado,
      pesoBrutoTotal: Number(peso) || 0,
      pesoBrutoUnidadMedida: "KGM",
      numeroBultos: Number(bultos) || 0,
      vehiculos: [{ placa: placa.toUpperCase(), autorizacionMTC: mtc, esPrincipal: true }],
      conductores: [{ tipoDoc: "1", ...cond, esPrincipal: true }],
      pagadorFlete: {
        tipo: pagadorTipo,
        tipoDoc: pagadorTipo !== "REMITENTE" ? "6" : "",
        numeroDoc: pagadorDoc,
        denominacion: pagadorDenom,
      },
      retornoConEnvases,
      retornoVehiculoVacio,
      transporteSubcontratado,
      observaciones: obs,
      items: items.map((i) => ({
        descripcion: i.descripcion,
        cantidad: Number(i.cantidad) || 1,
        unidadMedida: i.unidadMedida,
      })),
    };

    if (docsRelacionados.length > 0) {
      payload.documentosRelacionados = docsRelacionados;
    }

    if (transporteSubcontratado && subcontDoc) {
      payload.subcontratador = { tipoDoc: "6", numeroDoc: subcontDoc, denominacion: subcontDenom };
    }

    const endpoint = esTransportista ? "/documentos/gre-transportista" : "/documentos/gre-remitente";

    setLoading(true);
    try {
      const doc = await unwrap<DocumentoT>(api.post(endpoint, payload));
      router.push(`/app/documento?id=${doc._id}&nuevo=1`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-content">
        {esTransportista ? "GRE Transportista" : "GRE Remitente"}
      </h1>
      <p className="text-sm text-muted">Solo llena y emite.</p>

      {/* Tipo selector */}
      <div className="mt-4 flex gap-2">
        {(["GRE_REMITENTE", "GRE_TRANSPORTISTA"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTipoGre(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tipoGre === t
                ? "bg-brand-green text-white"
                : "bg-elevated text-muted hover:text-content"
            }`}
          >
            {t === "GRE_REMITENTE" ? "Remitente" : "Transportista"}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-muted">Serie: {serie}</span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          {/* Documentos relacionados (transportista only) */}
          {esTransportista && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" /> Documentos relacionados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted">Vincula la GRE remitente que origina este traslado</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Serie (T001)"
                    value={docRelSerie}
                    onChange={(e) => setDocRelSerie(e.target.value)}
                    maxLength={4}
                    className="w-24"
                  />
                  <Input
                    placeholder="Número"
                    value={docRelNumero}
                    onChange={(e) => setDocRelNumero(e.target.value)}
                    className="w-24"
                  />
                  <Button size="sm" onClick={buscarDocRelacionado} disabled={searchingDoc}>
                    <Search className="h-4 w-4" /> {searchingDoc ? "..." : "Buscar"}
                  </Button>
                </div>
                {docsRelacionados.map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-elevated p-3">
                    <div>
                      <span className="font-medium text-content">{d.serie}-{d.numero}</span>
                      {linkedDocs[i] && (
                        <span className="ml-2 text-xs text-muted">
                          {linkedDocs[i].cliente.denominacion} • {linkedDocs[i].estado}
                        </span>
                      )}
                    </div>
                    <button onClick={() => removeDocRel(i)}>
                      <X className="h-4 w-4 text-danger" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Destinatario */}
          <Card>
            <CardHeader>
              <CardTitle>Destinatario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {esTransportista && hasLinkedDocs && (
                <p className="rounded-lg bg-brand-green/10 p-2 text-xs text-brand-green">
                  Importado del documento relacionado
                </p>
              )}
              <div>
                <Label>RUC / Documento</Label>
                <Input
                  value={cli.numeroDoc}
                  onChange={(e) => setCli({ ...cli, numeroDoc: e.target.value })}
                  disabled={esTransportista && hasLinkedDocs}
                />
              </div>
              <div>
                <Label>Denominación</Label>
                <Input
                  value={cli.denominacion}
                  onChange={(e) => setCli({ ...cli, denominacion: e.target.value })}
                  disabled={esTransportista && hasLinkedDocs}
                />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input
                  value={cli.direccion}
                  onChange={(e) => setCli({ ...cli, direccion: e.target.value })}
                  disabled={esTransportista && hasLinkedDocs}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bienes */}
          <Card>
            <CardHeader>
              <CardTitle>Bienes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {esTransportista && hasLinkedDocs && (
                <p className="rounded-lg bg-brand-green/10 p-2 text-xs text-brand-green">
                  Bienes importados del documento relacionado
                </p>
              )}
              {items.map((it, i) => (
                <div key={i} className="rounded-xl bg-elevated p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted">Bien {i + 1}</span>
                    {items.length > 1 && !(esTransportista && hasLinkedDocs) && (
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
                    disabled={esTransportista && hasLinkedDocs && !transbordoProgramado}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Cantidad"
                      value={it.cantidad}
                      onChange={(e) => setItem(i, { cantidad: e.target.value })}
                      disabled={esTransportista && hasLinkedDocs && !transbordoProgramado}
                    />
                    <Select
                      value={it.unidadMedida}
                      onChange={(e) => setItem(i, { unidadMedida: e.target.value })}
                      disabled={esTransportista && hasLinkedDocs && !transbordoProgramado}
                    >
                      {UNIDADES.map((u) => (
                        <option key={u.codigo} value={u.codigo}>{u.nombre}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
              {!(esTransportista && hasLinkedDocs) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setItems((a) => [...a, { descripcion: "", cantidad: "1", unidadMedida: "NIU" }])}
                >
                  <Plus className="h-4 w-4" /> Agregar bien
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Peso bruto (KG)</Label>
                  <Input
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    disabled={esTransportista && hasLinkedDocs}
                  />
                </div>
                <div>
                  <Label>N° bultos</Label>
                  <Input
                    value={bultos}
                    onChange={(e) => setBultos(e.target.value)}
                    disabled={esTransportista && hasLinkedDocs}
                  />
                </div>
              </div>
              {esTransportista && (
                <label className="flex items-center gap-2 text-sm text-content">
                  <input
                    type="checkbox"
                    checked={transbordoProgramado}
                    onChange={(e) => setTransbordoProgramado(e.target.checked)}
                    className="rounded"
                  />
                  Realiza transbordo programado
                </label>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Traslado */}
          <Card>
            <CardHeader>
              <CardTitle>Traslado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {esTransportista && hasLinkedDocs && (
                <p className="rounded-lg bg-brand-green/10 p-2 text-xs text-brand-green">
                  Ruta importada del documento relacionado
                </p>
              )}
              <Label>Punto de partida</Label>
              {!(esTransportista && hasLinkedDocs) ? (
                <UbigeoSelect onChange={(u) => setPartida((p) => ({ ...p, ubigeo: u }))} />
              ) : (
                <Input value={partida.ubigeo} disabled />
              )}
              <Input
                placeholder="Dirección de partida"
                value={partida.direccion}
                onChange={(e) => setPartida({ ...partida, direccion: e.target.value })}
                disabled={esTransportista && hasLinkedDocs}
              />
              <Label className="pt-2">Punto de llegada</Label>
              {!(esTransportista && hasLinkedDocs) ? (
                <UbigeoSelect onChange={(u) => setLlegada((p) => ({ ...p, ubigeo: u }))} />
              ) : (
                <Input value={llegada.ubigeo} disabled />
              )}
              <Input
                placeholder="Dirección de llegada"
                value={llegada.direccion}
                onChange={(e) => setLlegada({ ...llegada, direccion: e.target.value })}
                disabled={esTransportista && hasLinkedDocs}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <Label>Motivo</Label>
                  <Select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    disabled={esTransportista && hasLinkedDocs}
                  >
                    {MOTIVOS.map((m) => (
                      <option key={m.codigo} value={m.codigo}>{m.nombre}</option>
                    ))}
                  </Select>
                </div>
                {!esTransportista && (
                  <div>
                    <Label>Modalidad</Label>
                    <Select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                      <option value="02">Privado</option>
                      <option value="01">Público</option>
                    </Select>
                  </div>
                )}
              </div>
              {!esTransportista && (
                <label className="flex items-center gap-2 text-sm text-content">
                  <input
                    type="checkbox"
                    checked={transbordoProgramado}
                    onChange={(e) => setTransbordoProgramado(e.target.checked)}
                    className="rounded"
                  />
                  Realiza transbordo programado
                </label>
              )}
            </CardContent>
          </Card>

          {/* Transporte */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de transporte</CardTitle>
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

          {/* Pagador del flete */}
          <Card>
            <CardHeader>
              <CardTitle>Pagador del flete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                {(["REMITENTE", "SUBCONTRATADOR", "OTRO"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPagadorTipo(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      pagadorTipo === t
                        ? "bg-brand-green text-white"
                        : "bg-elevated text-muted hover:text-content"
                    }`}
                  >
                    {t === "REMITENTE" ? "Remitente" : t === "SUBCONTRATADOR" ? "Subcontratador" : "Otro"}
                  </button>
                ))}
              </div>
              {pagadorTipo !== "REMITENTE" && (
                <>
                  <div>
                    <Label>Documento del pagador</Label>
                    <Input value={pagadorDoc} onChange={(e) => setPagadorDoc(e.target.value)} />
                  </div>
                  <div>
                    <Label>Denominación</Label>
                    <Input value={pagadorDenom} onChange={(e) => setPagadorDenom(e.target.value)} />
                  </div>
                </>
              )}
              <div className="space-y-1 pt-2">
                <label className="flex items-center gap-2 text-sm text-content">
                  <input type="checkbox" checked={retornoConEnvases} onChange={(e) => setRetornoConEnvases(e.target.checked)} className="rounded" />
                  Retorno con envases vacíos
                </label>
                <label className="flex items-center gap-2 text-sm text-content">
                  <input type="checkbox" checked={retornoVehiculoVacio} onChange={(e) => setRetornoVehiculoVacio(e.target.checked)} className="rounded" />
                  Retorno de vehículo vacío
                </label>
                <label className="flex items-center gap-2 text-sm text-content">
                  <input type="checkbox" checked={transporteSubcontratado} onChange={(e) => setTransporteSubcontratado(e.target.checked)} className="rounded" />
                  Transporte subcontratado
                </label>
              </div>
              {transporteSubcontratado && (
                <div className="space-y-2 rounded-lg bg-elevated p-3">
                  <p className="text-xs font-medium text-content">Datos del subcontratador</p>
                  <div>
                    <Label>RUC</Label>
                    <Input value={subcontDoc} onChange={(e) => setSubcontDoc(e.target.value)} />
                  </div>
                  <div>
                    <Label>Denominación</Label>
                    <Input value={subcontDenom} onChange={(e) => setSubcontDenom(e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observaciones */}
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
