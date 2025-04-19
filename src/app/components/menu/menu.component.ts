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
import { TipoPlatoService } from '../../services/tipo-plato.service';
import { kindDishRead } from '../../dto/category-dish/categoryReadDto';

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
  categories: kindDishRead[] = [];


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
    id_tipo_plato: null
  };
  


  //State to edit
  editingDish: PlatoUpdate | null = null;
  editingDishId: number | null = null;
  showEditModal: boolean = false;

  constructor(private platoService: PlatoService, private tipoPlatoService: TipoPlatoService) {
    this.updatePagination();
  }

  ngOnInit(): void {
    this.getAllDishes();
    this.getAllKindDishes();
  
  }

  filterDishes() {
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

  onCategorySelected(categoryName: string): void {
    this.selectedCategory = categoryName;
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

  //Add a new dish

  addNewDish(): void {
    // Validación mejorada con mensajes específicos
    if (!this.newDish.nombre?.trim()) {
      showAlert('El nombre del plato es requerido', 'error');
      return;
    }

    if (!this.newDish.descripcion?.trim()) {
      showAlert('La descripción es requerida', 'error');
      return;
    }

    if (!this.newDish.precio || this.newDish.precio <= 0) {
      showAlert('El precio debe ser mayor a 0', 'error');
      return;
    }

    if (this.newDish.id_tipo_plato === null) {
      console.log('categoria seleccionada: ', this.newDish.id_tipo_plato)
      showAlert('Debes seleccionar una categoría', 'error');
      return;
    }
    
    const platoToSend = {
      ...this.newDish,
      precio: Number(this.newDish.precio), // esto sí es válido y útil
      id_tipo_plato: this.newDish.id_tipo_plato // ya es number, no hace falta convertir
    };
    console.log('Tipo de id_tipo_plato:', typeof this.newDish.id_tipo_plato);
    console.log('Valor de id_tipo_plato:', this.newDish.id_tipo_plato);
  
    console.log('Enviando:', platoToSend); // Para depuración
  
    this.platoService.savePlato(platoToSend).subscribe({
      next: (response) => {
        if (!response.error) {
          this.getAllDishes();
          this.closeAddDishModal();
          this.resetNewDishForm();
            showAlert(`✅ Platillo agregado con ID: ${response.respuesta}`, 'success');
        } else {
          showAlert('Error en el servidor: ' + response.respuesta, 'error');
        }
      },
      error: (err) => {
        showAlert('Error de conexión: ' + err.message, 'error');
      }
    });
  }
  
  // Función para resetear el formulario
  resetNewDishForm(): void {
    this.newDish = {
      nombre: '',
      descripcion: '',
      precio: 0,
      id_tipo_plato: 1 // Valor por defecto
    };
  }

//---------edit-------------  
onEditDish(dish: platoReadDto): void {
  this.editingDishId = dish.id;
  this.editingDish = {
    nombre: dish.nombre,
    precio: dish.precio,
    id_tipo_plato: Number(dish.tipo_plato), //valor numérico correcto ya viene del backend
    descripcion: dish.descripcion
  };
  this.showEditModal = true;
}



  onSaveEdit(): void {
    if (this.editingDishId !== null && this.editingDish) {
      console.log('Enviando:', this.editingDish, 'id: ',this.editingDishId ); // Para depuración
      this.platoService.editPlato(this.editingDishId, this.editingDish).subscribe({
        next: (response: MessageDTO<platoReadDto>) => {
          if (!response.error) {
            console.log('Plato actualizado correctamente:', response.respuesta);
            showAlert(`✅ Plato actualizado correctamente: ${response.respuesta}`, 'success');
            this.getAllDishes();
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
