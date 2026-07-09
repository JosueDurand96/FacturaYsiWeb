"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Truck } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { VehiculoT } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

export default function VehiculosPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ placa: "", descripcion: "", numeroAutorizacionMTC: "", capacidadCargaTM: "0" });

  const { data } = useQuery({
    queryKey: ["vehiculos"],
    queryFn: () => unwrap<VehiculoT[]>(api.get("/vehiculos")),
  });

  const crear = useMutation({
    mutationFn: () =>
      unwrap(
        api.post("/vehiculos", {
          placa: form.placa,
          descripcion: form.descripcion,
          numeroAutorizacionMTC: form.numeroAutorizacionMTC,
          capacidadCargaTM: Number(form.capacidadCargaTM) || 0,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehiculos"] });
      setOpen(false);
      setForm({ placa: "", descripcion: "", numeroAutorizacionMTC: "", capacidadCargaTM: "0" });
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => unwrap(api.delete(`/vehiculos/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehiculos"] }),
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content">Vehículos</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Agregar
        </Button>
      </div>

      <div className="mt-5 space-y-2">
        {(data ?? []).map((v) => (
          <Card key={v._id} className="flex items-center gap-3 p-4">
            <Truck className="h-5 w-5 text-brand-green" />
            <div className="flex-1">
              <p className="font-semibold text-content">{v.placa}</p>
              <p className="text-sm text-muted">{v.descripcion}</p>
            </div>
            <button onClick={() => eliminar.mutate(v._id)}>
              <Trash2 className="h-4 w-4 text-danger" />
            </button>
          </Card>
        ))}
        {data && data.length === 0 && <p className="text-sm text-muted">Sin vehículos.</p>}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Nuevo vehículo">
        <div className="space-y-3">
          <div>
            <Label>Placa</Label>
            <Input value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div>
            <Label>N° Autorización MTC</Label>
            <Input
              value={form.numeroAutorizacionMTC}
              onChange={(e) => setForm({ ...form, numeroAutorizacionMTC: e.target.value })}
            />
          </div>
          <Button className="w-full" onClick={() => crear.mutate()} disabled={crear.isPending || !form.placa}>
            {crear.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
