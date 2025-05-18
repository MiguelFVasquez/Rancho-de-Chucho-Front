import { IngredientePlatoDto } from "./PlatoCreateDto";

// Interface to represent 'platoReadDto' from backend
export interface platoReadDto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo_plato: string;
    activo:boolean;
    listaIngredientes: IngredientePlatoDto[];
}
  