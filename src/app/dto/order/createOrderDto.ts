export interface OrdenCreateDto {
    idMesa: number;
    cedulaMesero: string;
    platillos: PlatilloCantidadDTO[];
}
  
export interface PlatilloCantidadDTO {
    idPlato:number;
    cantidad: number;
}
  