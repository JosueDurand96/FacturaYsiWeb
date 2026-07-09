"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Star,
  Truck,
  Users,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/app/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/app/historial", label: "Historial", icon: History },
  { href: "/app/frecuentes", label: "Frecuentes", icon: Star },
  { href: "/app/vehiculos", label: "Vehículos", icon: Truck },
  { href: "/app/conductores", label: "Conductores", icon: Users },
  { href: "/app/perfil", label: "Perfil", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { empresa, logout } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel md:flex">
      <Link href="/app/dashboard" className="flex items-center gap-3 px-6 py-5">
        <Image src="/logo.png" alt="FacturaYsi" width={36} height={36} className="rounded-lg" />
        <div>
          <p className="text-sm font-bold text-content">FacturaYsi</p>
          <p className="max-w-[150px] truncate text-xs text-muted">
            {empresa?.razonSocial ?? "Mi empresa"}
          </p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-green/15 text-brand-green"
                  : "text-muted hover:bg-elevated hover:text-content"
              )}
            >
              <l.icon className="h-[18px] w-[18px]" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-elevated hover:text-danger"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Cerrar sesión
      </button>
    </aside>
  );
}
