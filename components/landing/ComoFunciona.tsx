import { UserPlus, FileEdit, CheckCircle2 } from "lucide-react";

const pasos = [
  { icon: UserPlus, title: "Regístrate", text: "Crea tu cuenta y conecta tu RUC. Sin certificado digital." },
  { icon: FileEdit, title: "Emite", text: "Una sola pantalla. Autocompleta destinatarios, vehículos y rutas." },
  { icon: CheckCircle2, title: "Listo", text: "Enviamos a SUNAT vía Nubefact y recibes tu PDF, XML y CDR." },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="border-y border-line/60 bg-panel/40">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-2xl font-bold text-content sm:text-3xl">
          Cómo funciona
        </h2>
        <p className="mt-2 text-center text-muted">De 28 pasos a 3.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pasos.map((p, i) => (
            <div key={p.title} className="relative rounded-2xl border border-line bg-panel p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-line">
                {i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/15">
                <p.icon className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-content">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
