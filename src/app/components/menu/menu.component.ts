import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from '../menu-card/menu-card.component';
import { platoReadDto } from '../../dto/dish/dishdto';
import { FormsModule } from '@angular/forms';
import { DishDetailDto } from '../../dto/dish/dishDetailDto';
import { MenuDetailComponent } from "../menu-detail/menu-detail.component";
import { PlatoService } from '../../services/plato.service';
import { MessageDTO } from '../../dto/messageDto';
import { PlatoUpdate } from '../../dto/dish/PlatoUpdateDto';
import { showAlert } from '../../dto/alert';
import { platoCreate } from '../../dto/dish/PlatoCreateDto';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuCardComponent, FormsModule, MenuDetailComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  
  dishes: platoReadDto[] = [];
  filteredDishes: platoReadDto[] = [];
  paginatedDishes: platoReadDto[] = [];
  categories: string[] = ['Platos Fuertes', 'Bebidas', 'Snack', 'Postres'];


  selectedCategory: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  showCategoryDialog: boolean = false;
  selectedDishDetail: platoReadDto | null = null;
  //State to add
  showAddDishModal: boolean = false;

  newDish: platoCreate = {
    nombre: '',
    descripcion: '',
    precio: 0,
    id_tipo_plato: 1 // Valor inicial por defecto
  };


  //State to edit
  editingDish: PlatoUpdate | null = null;
  editingDishId: number | null = null;
  showEditModal: boolean = false;

  /**TO DETAIL */
  //Descrptions simulated

  // private getDishDescription(name: string): string {
  //   const descriptions: { [key: string]: string } = {
  //     'Tacos al Pastor': 'Tacos tradicionales con carne adobada al estilo pastor.',
  //     'Frijoles con chicharron': 'Frijoles acompañados de crujiente chicharrón.',
  //     'Sancocho': 'Sopa tradicional con variedad de carnes y verduras.',
  //     'Bandeja paisa': 'Plato típico con arroz, frijoles, chicharrón y más.',
  //     'Empanadas': 'Empanadas rellenas de carne y papa con ají casero.',
  //     'Arroz con leche': 'Postre cremoso a base de arroz y leche con canela.',
  //   };
  //   return descriptions[name] || 'Descripción no disponible.';
  // }
  constructor(private platoService: PlatoService) {
    this.updatePagination();
  }

  ngOnInit(): void {
    this.getAllDishes();
  }

  //Method to get all dishes 
  getAllDishes(): void {
    this.platoService.getAllDishs().subscribe({
      next: (response: MessageDTO<platoReadDto[]>) => {
        if (!response.error) {
          this.dishes = response.respuesta; 
          this.onSearch();
        } else {
          console.error('Error obteniendo platos:', response);
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
      },
    });
  }

  //detail of the dish
  onViewDetail(dish: platoReadDto) {
    this.selectedDishDetail = dish;
  }
  //Close detail view
  onCloseDetail() {
    this.selectedDishDetail = null;
  }

  openCategoryDialog(): void {
    this.showCategoryDialog = true;
  }

  closeCategoryDialog(): void {
    this.showCategoryDialog = false;
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.showCategoryDialog = false;
    this.onSearch();
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDishes = this.dishes.filter(
      (dish) =>
        dish.nombre.toLowerCase().includes(term) &&
        (this.selectedCategory ? dish.tipo_plato === this.selectedCategory : true)
    );
    this.currentPage = 1;
    this.updatePagination();
  }
  //----------PAGINATION----------------
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDishes.length / this.itemsPerPage) || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDishes = this.filteredDishes.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

//----------add---------

  openAddDishModal(): void {
    this.showAddDishModal = true;
  }

  closeAddDishModal(): void {
    this.showAddDishModal = false;
  }

  addNewDish(): void {
    if (!this.newDish.nombre || !this.newDish.descripcion || this.newDish.precio <= 0) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    this.platoService.savePlato(this.newDish).subscribe(response => {
      if (!response.error) {
        this.dishes.push({ id: Date.now(), ...this.newDish, tipo_plato: this.categories[this.newDish.id_tipo_plato - 1] });
        this.onSearch();
        showAlert(`✅ Plato actualizado correctamente: ${response.respuesta}`, 'success');
        this.closeAddDishModal();
      } else {
        alert('Error al agregar el platillo.');
      }
    });
  
  }

//---------edit-------------  
  //Solo por pruebas temporales: 
    // Simulación de mapeo de tipos de plato a IDs (debería venir del backend)
    tipoPlatoMap: { [key: string]: number } = {
      'Platos Fuertes': 1,
      'Bebidas': 2,
      'Snack': 3,
      'Postres': 4
    };
 
  onEditDish(dish: platoReadDto): void {
    this.editingDishId = dish.id;
    this.editingDish = { 
      nombre: dish.nombre,
      precio: dish.precio,
      id_tipo_plato: this.tipoPlatoMap[dish.tipo_plato] || 0 ,
      descripcion: dish.descripcion
    };
    this.showEditModal = true;
  }


  onSaveEdit(): void {
    if (this.editingDishId !== null && this.editingDish) {
      this.platoService.editPlato(this.editingDishId, this.editingDish).subscribe({
        next: (response: MessageDTO<platoReadDto>) => {
          if (!response.error) {
            console.log('Plato actualizado correctamente:', response.respuesta);
            showAlert(`✅ Plato actualizado correctamente: ${response.respuesta}`, 'success');
            
            // Actualizar la lista de platos
            const index = this.dishes.findIndex(d => d.id === response.respuesta.id);
            if (index !== -1) {
              this.dishes[index] = response.respuesta;
              this.onSearch(); // Actualizar la vista
            }
            this.showEditModal = false;
          } else {
            console.error('Error al actualizar el plato:', response);
            showAlert('❌ Error al editar el plato.', 'error');
          }
        },
        error: (err) => {
          console.error('Error en la actualización:', err);
        },
      });
    }
  }

  //Method to connect with the service to delete a specific dish
  onDeleteDish(dish: platoReadDto): void {
    if (confirm(`¿Seguro que quieres eliminar ${dish.nombre}?`)) {
      this.platoService.deletePlato(dish.id).subscribe({
        next: (response: MessageDTO<boolean>) => {
          if (!response.error && response.respuesta) {
            console.log(`Plato ${dish.nombre} eliminado correctamente.`);
            showAlert(`✅ Plato ${dish.nombre} eliminado correctamente: ${response.respuesta}`, 'success');
            this.dishes = this.dishes.filter((d) => d.id !== dish.id);
            this.onSearch(); // Actualizar lista
          } else {
            console.error('Error al eliminar el plato:', response);
            showAlert('❌ Error al eliminar el plato.', 'error');
          }
        },
        error: (err) => {
          console.error('Error en la eliminación:', err);
        },
      });
    }
  }
}
