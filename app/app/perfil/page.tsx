"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

interface Consumo {
  docsEmitidosMes: number;
  limiteDocsMes: number;
  porcentajeUsado: number;
}

export default function PerfilPage() {
  const { user, empresa } = useAuth();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [msg, setMsg] = useState("");

  const consumo = useQuery({
    queryKey: ["consumo"],
    queryFn: () => unwrap<Consumo>(api.get("/empresa/consumo")),
  });

  const cambiar = async () => {
    setMsg("");
    if (nueva.length < 6) {
      setMsg("La nueva contraseña debe tener 6+ caracteres");
      return;
    }
    try {
      await unwrap(api.post("/auth/change-password", { passwordActual: actual, passwordNueva: nueva }));
      setMsg("Contraseña actualizada");
      setActual("");
      setNueva("");
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  const pct = consumo.data?.porcentajeUsado ?? 0;
  const barColor = pct >= 90 ? "bg-danger" : pct >= 70 ? "bg-amber" : "bg-brand-green";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-content">Perfil</h1>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <Row k="Razón social" v={empresa?.razonSocial ?? "—"} />
          <Row k="RUC" v={empresa?.ruc ?? "—"} />
          <Row k="N° MTC" v={empresa?.numeroRegistroMTC || "No registrado"} />
          <Row k="Usuario" v={user?.email ?? "—"} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Consumo del mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-3 w-full overflow-hidden rounded-full bg-elevated">
            <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {consumo.data?.docsEmitidosMes ?? 0} / {consumo.data?.limiteDocsMes ?? 500} documentos ({pct}%)
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Contraseña actual</Label>
            <Input type="password" value={actual} onChange={(e) => setActual(e.target.value)} />
          </div>
          <div>
            <Label>Nueva contraseña</Label>
            <Input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
          </div>
          {msg && <p className="text-sm text-muted">{msg}</p>}
          <Button onClick={cambiar}>Actualizar</Button>
        </CardContent>
      </Card>
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
