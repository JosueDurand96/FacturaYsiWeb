import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaFinal() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20">
      <div className="rounded-3xl border border-brand-green/40 bg-gradient-to-b from-brand-green/10 to-transparent p-10 text-center">
        <h2 className="text-3xl font-extrabold text-content">
          Empieza a emitir hoy mismo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          7 días gratis. Sin tarjeta. Un camionero de 60 años lo usa sin manual.
        </p>
        <Link href="/registro" className="mt-6 inline-block">
          <Button size="lg">Comenzar gratis</Button>
        </Link>
      </div>
    </section>
  );
}
