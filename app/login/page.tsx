"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, unwrap } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { UserT, EmpresaT } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const [ruc, setRuc] = useState("20512345678");
  const [usuario, setUsuario] = useState("julio@transportesjc.pe");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await unwrap<{ token: string; user: UserT; empresa: EmpresaT | null }>(
        api.post("/auth/login", { ruc, usuario, password })
      );
      setSession(data.token, data.user, data.empresa);
      router.push("/app/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-8">
        <Link href="/" className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/splash_icon.png"
            alt="FacturaYsi"
            width={512}
            height={512}
            priority
            className="mb-4 h-auto w-28"
          />
          <Image
            src="/splash_branding.png"
            alt="FacturaYsi — Emisión electrónica fácil"
            width={900}
            height={220}
            priority
            className="mb-2 h-auto w-full max-w-xs"
          />
          <p className="text-sm text-muted">Emite en segundos, sin enredos</p>
        </Link>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>RUC</Label>
            <Input value={ruc} onChange={(e) => setRuc(e.target.value)} maxLength={11} />
          </div>
          <div>
            <Label>Usuario</Label>
            <Input value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted">
          Conectado con SUNAT. Tu sesión no se vence a la mitad.
        </p>
        <p className="mt-4 text-center text-sm text-muted">
          ¿Sin cuenta?{" "}
          <Link href="/registro" className="text-brand-green">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
