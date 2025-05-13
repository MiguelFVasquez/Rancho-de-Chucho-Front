export interface IngredientePlatoDto {
  idIngrediente: number;
  notacionUnidadMedida: string;
  cantidad: number;
}

export interface PlatoCreate {
  nombre: string;
  descripcion: string;
  precio: number;
  id_tipo_plato: number | null;
  listaIngredientes: IngredientePlatoDto[]; // <- nueva propiedad
}

