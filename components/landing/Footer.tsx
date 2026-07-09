import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="FacturaYsi" width={32} height={32} className="rounded-lg" />
          <div>
            <p className="font-bold text-content">FacturaYsi</p>
            <p className="text-xs text-muted">Emisión electrónica fácil</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted">
          <Link href="/precios" className="hover:text-content">Precios</Link>
          <Link href="/faq" className="hover:text-content">FAQ</Link>
          <Link href="/casos-de-uso" className="hover:text-content">Casos de uso</Link>
          <span className="hover:text-content">Términos</span>
          <span className="hover:text-content">Privacidad</span>
        </nav>
        <p className="text-xs text-muted">© {new Date().getFullYear()} FacturaYsi</p>
      </div>
    </footer>
  );
}
