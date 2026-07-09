"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Splash único: ícono centro + branding abajo. Fade suave, sin flash. */
export function AppSplash() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    const out = window.setTimeout(() => setPhase("out"), 1200);
    const gone = window.setTimeout(() => setPhase("gone"), 1750);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(gone);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[9999] bg-bg transition-opacity duration-500 ease-out ${
        phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/splash_mark.png"
          alt="FacturaYsi"
          width={720}
          height={720}
          priority
          className="h-auto w-[55vw] max-w-[220px]"
        />
      </div>
      <div className="absolute inset-x-7 bottom-24 flex justify-center sm:bottom-28">
        <Image
          src="/splash_branding.png"
          alt="FacturaYsi — Emisión electrónica fácil"
          width={1000}
          height={260}
          priority
          className="h-auto w-full max-w-[320px]"
        />
      </div>
    </div>
  );
}
