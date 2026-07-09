import { Star } from "lucide-react";

const testimonios = [
  {
    nombre: "Julio C.",
    empresa: "Transportes JC SAC",
    texto: "Antes tardaba 15 minutos por guía. Ahora emito en 40 segundos desde el celular.",
  },
  {
    nombre: "María F.",
    empresa: "Ferretería El Constructor",
    texto: "Guardé mis clientes frecuentes y ya no reescribo nada. Facturar es un toque.",
  },
  {
    nombre: "Rosa G.",
    empresa: "Distribuidora Andina",
    texto: "Mis choferes emiten guías solos, sin llamarme. Se acabó el caos.",
  },
];

export function Testimonios() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center text-2xl font-bold text-content sm:text-3xl">
        Lo que dicen nuestros usuarios
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonios.map((t) => (
          <div key={t.nombre} className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-green text-brand-green" />
              ))}
            </div>
            <p className="mt-4 text-sm text-content">&ldquo;{t.texto}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold text-content">{t.nombre}</p>
            <p className="text-xs text-muted">{t.empresa}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
