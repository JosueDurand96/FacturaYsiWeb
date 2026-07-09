import * as React from "react";
import { cn } from "@/lib/utils";
import { ESTADO_LABEL } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "blue" | "muted";
const tones: Record<Tone, string> = {
  green: "bg-success/15 text-success",
  amber: "bg-amber/15 text-amber",
  red: "bg-danger/15 text-danger",
  blue: "bg-info/15 text-info",
  muted: "bg-elevated text-muted",
};

export function Badge({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}
      {...props}
    />
  );
}

const estadoTone: Record<string, Tone> = {
  ACEPTADO_SUNAT: "green",
  PENDIENTE: "amber",
  OBSERVADO: "amber",
  RECHAZADO_SUNAT: "red",
  ANULADO: "red",
};

export function EstadoBadge({ estado }: { estado: string }) {
  return <Badge tone={estadoTone[estado] ?? "muted"}>{ESTADO_LABEL[estado] ?? estado}</Badge>;
}
