import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number, currency = "S/") {
  return `${currency} ${Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function serieNumero(serie: string, numero: number) {
  return `${serie}-${String(numero).padStart(6, "0")}`;
}

export const TIPO_LABEL: Record<string, string> = {
  GRE_REMITENTE: "Guía Remitente",
  GRE_TRANSPORTISTA: "Guía Transportista",
  FACTURA: "Factura",
  BOLETA: "Boleta",
};

export const ESTADO_LABEL: Record<string, string> = {
  ACEPTADO_SUNAT: "Aceptado",
  PENDIENTE: "En proceso",
  RECHAZADO_SUNAT: "Rechazado",
  ANULADO: "Anulado",
  OBSERVADO: "Observado",
};
