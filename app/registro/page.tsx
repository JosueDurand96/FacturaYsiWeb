"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, unwrap } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { UserT, EmpresaT } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function RegistroPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const [form, setForm] = useState({
    ruc: "",
    razonSocial: "",
    nombreComercial: "",
    email: "",
    password: "",
    nombres: "",
    apellidos: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await unwrap<{ token: string; user: UserT; empresa: EmpresaT | null }>(
        api.post("/auth/register-empresa", {
          ruc: form.ruc,
          razonSocial: form.razonSocial,
          nombreComercial: form.nombreComercial,
          admin: {
            email: form.email,
            password: form.password,
            nombres: form.nombres,
            apellidos: form.apellidos,
          },
        })
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
      <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-8">
        <h1 className="text-xl font-bold text-content">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-muted">7 días gratis. Sin tarjeta.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>RUC</Label>
              <Input value={form.ruc} maxLength={11} onChange={(e) => set("ruc", e.target.value)} />
            </div>
            <div>
              <Label>Nombre comercial</Label>
              <Input value={form.nombreComercial} onChange={(e) => set("nombreComercial", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Razón social</Label>
            <Input value={form.razonSocial} onChange={(e) => set("razonSocial", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nombres</Label>
              <Input value={form.nombres} onChange={(e) => set("nombres", e.target.value)} />
            </div>
            <div>
              <Label>Apellidos</Label>
              <Input value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-green">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
