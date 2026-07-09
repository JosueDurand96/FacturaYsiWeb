"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, User } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import type { ConductorT } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

export default function ConductoresPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ numeroDoc: "", nombres: "", apellidos: "", numeroLicencia: "", telefono: "" });

  const { data } = useQuery({
    queryKey: ["conductores"],
    queryFn: () => unwrap<ConductorT[]>(api.get("/conductores")),
  });

  const crear = useMutation({
    mutationFn: () => unwrap(api.post("/conductores", { tipoDoc: "1", ...form })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conductores"] });
      setOpen(false);
      setForm({ numeroDoc: "", nombres: "", apellidos: "", numeroLicencia: "", telefono: "" });
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => unwrap(api.delete(`/conductores/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conductores"] }),
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content">Conductores</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Agregar
        </Button>
      </div>

      <div className="mt-5 space-y-2">
        {(data ?? []).map((c) => (
          <Card key={c._id} className="flex items-center gap-3 p-4">
            <User className="h-5 w-5 text-brand-green" />
            <div className="flex-1">
              <p className="font-semibold text-content">
                {c.nombres} {c.apellidos}
              </p>
              <p className="text-sm text-muted">
                DNI {c.numeroDoc} · Lic. {c.numeroLicencia}
              </p>
            </div>
            <button onClick={() => eliminar.mutate(c._id)}>
              <Trash2 className="h-4 w-4 text-danger" />
            </button>
          </Card>
        ))}
        {data && data.length === 0 && <p className="text-sm text-muted">Sin conductores.</p>}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Nuevo conductor">
        <div className="space-y-3">
          <div>
            <Label>DNI</Label>
            <Input value={form.numeroDoc} onChange={(e) => setForm({ ...form, numeroDoc: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nombres</Label>
              <Input value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} />
            </div>
            <div>
              <Label>Apellidos</Label>
              <Input value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>N° Licencia</Label>
            <Input value={form.numeroLicencia} onChange={(e) => setForm({ ...form, numeroLicencia: e.target.value })} />
          </div>
          <Button
            className="w-full"
            onClick={() => crear.mutate()}
            disabled={crear.isPending || !form.numeroDoc || !form.nombres}
          >
            {crear.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
