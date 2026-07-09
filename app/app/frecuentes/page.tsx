"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Star } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { FrecuenteT } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

export default function FrecuentesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", numeroDoc: "", denominacion: "", direccion: "" });

  const { data } = useQuery({
    queryKey: ["frecuentes", "DESTINATARIO"],
    queryFn: () => unwrap<FrecuenteT[]>(api.get("/frecuentes/DESTINATARIO")),
  });

  const crear = useMutation({
    mutationFn: () =>
      unwrap(
        api.post("/frecuentes", {
          tipo: "DESTINATARIO",
          nombre: form.nombre,
          data: {
            tipoDoc: "6",
            numeroDoc: form.numeroDoc,
            denominacion: form.denominacion || form.nombre,
            direccion: form.direccion,
          },
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["frecuentes", "DESTINATARIO"] });
      setOpen(false);
      setForm({ nombre: "", numeroDoc: "", denominacion: "", direccion: "" });
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => unwrap(api.delete(`/frecuentes/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["frecuentes", "DESTINATARIO"] }),
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content">Destinatarios frecuentes</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Agregar
        </Button>
      </div>

      <div className="mt-5 space-y-2">
        {(data ?? []).map((f) => (
          <Card key={f._id} className="flex items-center gap-3 p-4">
            <Star className="h-5 w-5 text-amber" />
            <div className="flex-1">
              <p className="font-semibold text-content">{f.nombre}</p>
              <p className="text-sm text-muted">
                {String(f.data.numeroDoc ?? "")} · {f.usoCount} usos
              </p>
            </div>
            <button onClick={() => eliminar.mutate(f._id)}>
              <Trash2 className="h-4 w-4 text-danger" />
            </button>
          </Card>
        ))}
        {data && data.length === 0 && <p className="text-sm text-muted">Sin frecuentes.</p>}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Nuevo destinatario">
        <div className="space-y-3">
          <div>
            <Label>Nombre / alias</Label>
            <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <Label>RUC / Documento</Label>
            <Input value={form.numeroDoc} onChange={(e) => setForm({ ...form, numeroDoc: e.target.value })} />
          </div>
          <div>
            <Label>Denominación</Label>
            <Input value={form.denominacion} onChange={(e) => setForm({ ...form, denominacion: e.target.value })} />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </div>
          <Button className="w-full" onClick={() => crear.mutate()} disabled={crear.isPending || !form.nombre}>
            {crear.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
