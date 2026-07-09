import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const incluye = [
  "500 documentos incluidos al mes",
  "GRE, boletas y facturas ilimitadas (hasta el límite)",
  "App móvil (Android/iOS) + web",
  "Destinatarios, vehículos y rutas guardados",
  "Envío automático a SUNAT vía Nubefact",
  "Sin costo de instalación ni certificado digital",
];

export function Pricing() {
  return (
    <section id="precios" className="border-y border-line/60 bg-panel/40">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center text-2xl font-bold text-content sm:text-3xl">
          Un solo plan, sin sorpresas
        </h2>
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-brand-green/40 bg-panel p-8">
          <p className="text-sm font-semibold text-brand-green">Plan Único</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-5xl font-extrabold text-content">S/ 80</span>
            <span className="mb-1.5 text-muted">/mes</span>
          </div>
          <ul className="mt-6 space-y-3">
            {incluye.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-content">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                {i}
              </li>
            ))}
          </ul>
          <Link href="/registro" className="mt-8 block">
            <Button size="lg" className="w-full">Comenzar gratis 7 días</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
