"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="FacturaYsi" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-extrabold text-content">FacturaYsi</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href="/#como-funciona" className="hover:text-content">Cómo funciona</a>
          <a href="/#para-quien" className="hover:text-content">Para quién</a>
          <Link href="/precios" className="hover:text-content">Precios</Link>
          <Link href="/faq" className="hover:text-content">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Ingresar</Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Comenzar gratis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
