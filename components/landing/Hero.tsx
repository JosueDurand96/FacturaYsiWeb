"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
      <div className="mx-auto max-w-4xl px-5 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
            Conectado con SUNAT vía Nubefact (PSE homologado)
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-content sm:text-5xl">
            Emite guías, boletas y facturas{" "}
            <span className="text-brand-green">en segundos</span>.
            <br /> Sin enredos con SUNAT.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Reemplazamos los 28 pasos del portal SUNAT por una sola pantalla. Guarda
            destinatarios, vehículos y rutas y reutilízalos con un toque.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/registro">
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar gratis 7 días <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="/#como-funciona">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver demo
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
