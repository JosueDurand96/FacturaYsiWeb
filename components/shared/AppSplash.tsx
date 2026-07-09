"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AppSplash() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 1100);
    const hideTimer = window.setTimeout(() => setVisible(false), 1700);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-bg transition-opacity duration-500 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex w-[min(360px,88vw)] flex-col items-center gap-7">
        <Image
          src="/splash_icon.png"
          alt="FacturaYsi"
          width={512}
          height={512}
          priority
          className="h-auto w-[34vw] max-w-[140px]"
        />
        <Image
          src="/splash_branding.png"
          alt="FacturaYsi — Emisión electrónica fácil"
          width={900}
          height={220}
          priority
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
