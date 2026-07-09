export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const UNIDADES = [
  { codigo: "NIU", nombre: "Unidad" },
  { codigo: "KGM", nombre: "Kilogramo" },
  { codigo: "TNE", nombre: "Tonelada" },
  { codigo: "LTR", nombre: "Litro" },
  { codigo: "MTR", nombre: "Metro" },
  { codigo: "BX", nombre: "Caja" },
  { codigo: "PK", nombre: "Paquete" },
  { codigo: "ZZ", nombre: "Servicio" },
];

export const MOTIVOS = [
  { codigo: "01", nombre: "Venta" },
  { codigo: "02", nombre: "Compra" },
  { codigo: "04", nombre: "Traslado entre establecimientos" },
  { codigo: "08", nombre: "Importación" },
  { codigo: "09", nombre: "Exportación" },
  { codigo: "13", nombre: "Otros" },
  { codigo: "14", nombre: "Venta sujeta a confirmación" },
  { codigo: "18", nombre: "Traslado emisor itinerante" },
  { codigo: "19", nombre: "Traslado a zona primaria" },
];
