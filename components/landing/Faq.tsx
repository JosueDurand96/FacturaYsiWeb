"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "¿Es legal?",
    a: "Sí. Emitimos a través de Nubefact, un PSE (Proveedor de Servicios Electrónicos) homologado por SUNAT. Los documentos son 100% válidos.",
  },
  {
    q: "¿Necesito certificado digital?",
    a: "No. Todo está incluido a través de Nubefact. No compras ni instalas nada.",
  },
  {
    q: "¿Qué pasa si excedo los 500 documentos?",
    a: "Te avisamos al acercarte al límite y puedes ampliar tu plan. Nunca quedas bloqueado sin aviso.",
  },
  {
    q: "¿Puedo emitir desde el celular?",
    a: "Sí. Tenemos app Android/iOS y también versión web para la PC. La misma cuenta funciona en ambas.",
  },
  {
    q: "¿Funciona sin internet?",
    a: "Necesitas conexión para enviar a SUNAT, pero puedes llenar la guía offline: guardamos el borrador y lo enviamos al recuperar la red.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-16">
      <h2 className="text-center text-2xl font-bold text-content sm:text-3xl">
        Preguntas frecuentes
      </h2>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-line bg-panel">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium text-content">{f.q}</span>
              <ChevronDown
                className={cn("h-5 w-5 text-muted transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && <p className="px-5 pb-5 text-sm text-muted">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
