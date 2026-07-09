export interface UserT {
  _id: string;
  email: string;
  nombres: string;
  apellidos: string;
  role: string;
  empresaId?: string | null;
}

export interface EmpresaT {
  _id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  numeroRegistroMTC: string;
  serieGRERemitente: string;
  serieFactura: string;
  serieBoleta: string;
  docsEmitidosMes: number;
  limiteDocsMes: number;
  precioMensual: number;
  planActivo: boolean;
}

export interface ClienteT {
  tipoDoc: string;
  numeroDoc: string;
  denominacion: string;
  direccion?: string;
  email?: string;
}

export interface ItemT {
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
  valorUnitario?: number;
  total?: number;
}

export interface DocumentoT {
  _id: string;
  tipo: string;
  serie: string;
  numero: number;
  cliente: ClienteT;
  estado: string;
  mensajeSunat: string;
  total: number;
  moneda: string;
  fechaEmision: string;
  enlacePdf: string;
  enlaceXml: string;
  enlaceCdr: string;
  qrCode: string;
  items: ItemT[];
  gre?: Record<string, unknown>;
}

export interface VehiculoT {
  _id: string;
  placa: string;
  numeroAutorizacionMTC: string;
  descripcion: string;
  capacidadCargaTM: number;
}

export interface ConductorT {
  _id: string;
  tipoDoc: string;
  numeroDoc: string;
  nombres: string;
  apellidos: string;
  numeroLicencia: string;
  telefono: string;
}

export interface FrecuenteT {
  _id: string;
  tipo: string;
  nombre: string;
  data: Record<string, unknown>;
  usoCount: number;
}
