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
      className={`fixed inset-0 z-[9999] bg-bg transition-opacity duration-500 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/splash_mark.png"
          alt="FacturaYsi"
          width={512}
          height={512}
          priority
          className="h-auto w-[42vw] max-w-[180px]"
        />
      </div>
      <div className="absolute inset-x-6 bottom-24 flex justify-center">
        <Image
          src="/splash_branding.png"
          alt="FacturaYsi — Emisión electrónica fácil"
          width={900}
          height={220}
          priority
          className="h-auto w-full max-w-sm"
        />
      </div>
    </div>
  );
}
