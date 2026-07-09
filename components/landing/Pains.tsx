import { Clock, XCircle, Wallet } from "lucide-react";

const pains = [
  {
    icon: Clock,
    title: "La web de SUNAT se cae cada 4 minutos",
    text: "Sesiones que caducan a la mitad y te hacen empezar de nuevo.",
  },
  {
    icon: XCircle,
    title: "28 pasos para una sola guía",
    text: "Secciones anidadas y jerga fiscal que nadie entiende.",
  },
  {
    icon: Wallet,
    title: "Pagas S/. 70 por apps enredadas",
    text: "FactuFacil / FacteSol replican la misma complejidad.",
  },
];

export function Pains() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center text-2xl font-bold text-content sm:text-3xl">
        ¿Cansado de pelear con SUNAT?
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pains.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/15">
              <p.icon className="h-5 w-5 text-danger" />
            </div>
            <h3 className="mt-4 font-semibold text-content">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
