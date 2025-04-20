import { PlatilloOrdenadoDto } from "./dishOrderDto";

export interface ordenReadDto {
    idOrden: number;
    fechaInicio: string; // ISO 8601 format, ex: "2025-04-19T12:30:00"
    fechaCierre: string | null;
    subtotal: number;
    impuestos: number;
    idMesa: number;
    cedulaMesero: string;
    estadoOrden: 'ESPERA' | 'PROCESO' | 'FINALIZADA' | 'CANCELADA';
    platos: PlatilloOrdenadoDto[];
}
  