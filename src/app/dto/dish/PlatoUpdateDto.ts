import { IngredientePlatoDto } from "./PlatoCreateDto";

export interface PlatoUpdate{
    //El id será pasado por la url
    nombre: string,
    descripcion: string,
    precio: number,
    id_tipo_plato: number //Se debe de obtener la lista de los tipos de plato acuales junto con su id para poder obtener este valor
    listaIngredientes: IngredientePlatoDto[]; // <- nueva propiedad
    
}