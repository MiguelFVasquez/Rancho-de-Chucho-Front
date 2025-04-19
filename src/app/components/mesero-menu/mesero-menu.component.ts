import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platoReadDto } from '../../dto/dish/dishdto';
import { kindDishRead } from '../../dto/category-dish/categoryReadDto';
import { PlatoService } from '../../services/plato.service';
import { TipoPlatoService } from '../../services/tipo-plato.service';
import { MessageDTO } from '../../dto/messageDto';
import { showAlert } from '../../dto/alert';

@Component({
  selector: 'app-mesero-menu',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mesero-menu.component.html',
  styleUrl: './mesero-menu.component.css'
})
export class MeseroMenuComponent {
  searchTerm: string = '';
  selectedCategory: string = '';

  categories: kindDishRead[] = [];
  
  //Platillos 
  dishes: platoReadDto[] = [];

  constructor(private platoService: PlatoService, private tipoPlatoService: TipoPlatoService) {

  }
  
    ngOnInit(): void {
      this.getAllDishes();
      this.getAllKindDishes();
    
    }
  

  // Filtrar platillos por categoría y búsqueda
  filteredDishes() {
    return this.dishes.filter(dish => {
      const matchesSearch = this.searchTerm === '' || dish.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || dish.tipo_plato === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  //Method to get all kind of dishes
    getAllKindDishes(): void {
      this.tipoPlatoService.getAllKindDishs().subscribe({
        next: (response:MessageDTO<kindDishRead[]>) =>{
          if(!response.error){
            this.categories= response.respuesta;
          }else{
            showAlert("Ha ocurrido un error a la hora de obtener todas las categorias de los platos", 'error')
          }
        }
      })
    }
  
  
  
    //Method to get all dishes 
    getAllDishes(): void {
      this.platoService.getAllDishs().subscribe({
        next: (response: MessageDTO<platoReadDto[]>) => {
          if (!response.error) {
            this.dishes = response.respuesta; 
          } else {
            console.error('Error obteniendo platos:', response);
          }
        },
        error: (err) => {
          console.error('Error en la petición:', err);
        },
      });
    }

}
