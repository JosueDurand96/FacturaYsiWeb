import { Truck, UtensilsCrossed, Wrench, Boxes, Sprout, Pill, ShoppingBag, HardHat } from "lucide-react";

const negocios = [
  { icon: Truck, label: "Transporte de carga" },
  { icon: UtensilsCrossed, label: "Restaurantes y bodegas" },
  { icon: Wrench, label: "Ferreterías" },
  { icon: Boxes, label: "Distribuidoras / mudanzas" },
  { icon: Sprout, label: "Agrícolas y agroexport" },
  { icon: Pill, label: "Farmacias con reparto" },
  { icon: ShoppingBag, label: "Tiendas con delivery" },
  { icon: HardHat, label: "Constructoras" },
];

export function ParaQuien() {
  return (
    <section id="para-quien" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center text-2xl font-bold text-content sm:text-3xl">
        Para cualquier MYPE que mueva productos
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {negocios.map((n) => (
          <div
            key={n.label}
            className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-panel p-6 text-center"
          >
            <n.icon className="h-7 w-7 text-brand-green" />
            <span className="text-sm text-content">{n.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
