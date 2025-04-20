export interface OrdenCreateDto {
    idMesa: number;
    cedulaMesero: string;
    platillos: PlatilloCantidadDTO[];
}
  
export interface PlatilloCantidadDTO {
    nombre: string;
    cantidad: number;
}
  