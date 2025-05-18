import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platoReadDto } from '../../dto/dish/dishdto';
import { FormsModule } from '@angular/forms';
import { PlatoService } from '../../services/plato.service';
import { MessageDTO } from '../../dto/messageDto';
import { PlatoUpdate } from '../../dto/dish/PlatoUpdateDto';
import { showAlert } from '../../dto/alert';
import { IngredientePlatoDto, PlatoCreate } from '../../dto/dish/PlatoCreateDto';
import { TipoPlatoService } from '../../services/tipo-plato.service';
import { kindDishRead } from '../../dto/category-dish/categoryReadDto';
import { productDto } from '../../dto/product/productDto';
import { units } from '../../dto/product/units';
import { InventoryService } from '../../services/product-service.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {

  //To load ingredents
  products: productDto[]=[];
  units: units[]=[];
  //Dtos to get dishes
  dishes: platoReadDto[] = [];
  filteredDishes: platoReadDto[] = [];
  paginatedDishes: platoReadDto[] = [];
  //Load categories and filters
  categories: kindDishRead[] = [];
  selectedCategory: string = '';
  showCategoryDialog: boolean = false;
  searchTerm: string = '';
  //Status filter
  selectedStatus: string = ''; // "activo", "inactivo" o ""

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  selectedDishDetail: platoReadDto | null = null;
  //State to add
  showAddDishModal: boolean = false;
  //To create a dish
  newDish: PlatoCreate = {
    nombre: '',
    descripcion: '',
    precio: 0,
    id_tipo_plato: null,
    listaIngredientes: []
  };

  //Selected dish
  selectedDish: platoReadDto | null = null;
  selectDish(dish: platoReadDto): void {
    this.selectedDish = dish;
  }
  
  //State to edit
  editingDish: PlatoUpdate = {
    nombre: '',
    descripcion: '',
    precio: 0,
    id_tipo_plato: 0,
    listaIngredientes: []
  };
  //Ingredent to edit
  ingredienteTemp: IngredientePlatoDto = {
    idIngrediente: 0,
    notacionUnidadMedida: '',
    cantidad: 0
  };
  
  editingDishId: number | null = null;
  showEditModal: boolean = false;

  constructor(private platoService: PlatoService, private tipoPlatoService: TipoPlatoService,private inventoryService: InventoryService) {
    this.updatePagination();
  }

  ngOnInit(): void {
    this.getAllDishes();
    this.getAllKindDishes();
    this.loadProducts();
    this.loadUnits();
    
  }
  //Load ingredents to create and edit dishes 
  loadProducts(): void {
    this.inventoryService.getAllProducts().subscribe({
      next: (response) => {
        if (!response.error && response.respuesta) {
          this.products = response.respuesta;
        } else {
          console.warn("La API no devolvió datos válidos.");
          this.products = [];
        }
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.products = [];
      }
    });
  }

  loadUnits():void{
    this.inventoryService.getUnits().subscribe({
      next:(response) => {
        if(!response.error && response.respuesta){
          this.units= response.respuesta
        }else{
          console.warn("La API no devolvió datos válidos.");
          this.units = [];
        }
      },
      error: (err) =>{
        console.error("Error en la petición:", err);
        this.units = [];
      }
    })
  }
  //Filter all dishes
  filterDishes() {
    return this.dishes.filter(dish => {
      const matchesSearch = this.searchTerm.trim() === '' || dish.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || dish.tipo_plato === this.selectedCategory;
      const matchesStatus =
        this.selectedStatus === '' ||
        (this.selectedStatus === 'inactivo' && dish.activo) || //The logic of this is inversive from the back
        (this.selectedStatus === 'activo' && !dish.activo);
  
      return matchesSearch && matchesCategory && matchesStatus;
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
  //To map product's names wiht id's
  getProductNameById(id: number): string {
    const product = this.products.find(p => p.id === id);
    return product ? product.nombre : `ID ${id}`;
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
    precio: Number(this.newDish.precio),
    id_tipo_plato: Number(this.newDish.id_tipo_plato),
    listaIngredientes: this.newDish.listaIngredientes.map(i => ({
      idIngrediente: Number(i.idIngrediente),
      notacionUnidadMedida: i.notacionUnidadMedida,
      cantidad: parseFloat(String(i.cantidad)) || 0
    }))
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

  //Function to add a ingredent on addDishModal
agregarIngrediente(): void {
  const { idIngrediente, notacionUnidadMedida, cantidad } = this.ingredienteTemp;

  if (
    idIngrediente !== null &&
    notacionUnidadMedida.trim() !== '' &&
    cantidad !== null &&
    Number(cantidad) > 0
  ) {
    this.newDish.listaIngredientes.push({
      idIngrediente,
      notacionUnidadMedida: notacionUnidadMedida.trim(),
      cantidad: Number(cantidad)
    });

    this.ingredienteTemp = {
      idIngrediente: 0,
      notacionUnidadMedida: '',
      cantidad: 0
    };
  } else {
    showAlert('Todos los campos del ingrediente son obligatorios y la cantidad debe ser mayor a 0', 'error');
  }
}

  
  eliminarIngrediente(index: number): void {
    this.newDish.listaIngredientes.splice(index, 1);
  }
  
  // Función para resetear el formulario
  resetNewDishForm(): void {
    this.newDish = {
      nombre: '',
      descripcion: '',
      precio: 0,
      id_tipo_plato: 1,
      listaIngredientes: []
    };
  }

//---------edit-------------
onEditDish(dish: platoReadDto): void {
  this.editingDishId = dish.id;
  this.editingDish = {
    nombre: dish.nombre,
    precio: dish.precio,
    id_tipo_plato: Number(dish.tipo_plato),
    descripcion: dish.descripcion,
    listaIngredientes: dish.listaIngredientes ?? [] // Asegúrate que venga del backend
  };
  this.showEditModal = true;
}

//Function to add a ingredent on EditDishModali
agregarIngredienteEdit(): void {
  const { idIngrediente, notacionUnidadMedida, cantidad } = this.ingredienteTemp;

  if (
    idIngrediente !== null &&
    notacionUnidadMedida.trim() !== '' &&
    cantidad !== null &&
    Number(cantidad) > 0
  ) {
    this.editingDish.listaIngredientes.push({
      idIngrediente,
      notacionUnidadMedida: notacionUnidadMedida.trim(),
      cantidad: Number(cantidad)
    });

    this.ingredienteTemp = {
      idIngrediente: 0,
      notacionUnidadMedida: '',
      cantidad: 0
    };
  } else {
    showAlert('Todos los campos del ingrediente son obligatorios y la cantidad debe ser mayor a 0', 'error');
  }
}


eliminarIngredienteEdit(index: number): void {
  this.editingDish.listaIngredientes.splice(index, 1);
}



onSaveEdit(): void {
  if (this.editingDishId !== null && this.editingDish) {
    this.platoService.editPlato(this.editingDishId, this.editingDish).subscribe({
      next: (response: MessageDTO<platoReadDto>) => {
        if (!response.error) {
          showAlert(`✅ Plato actualizado correctamente: ${response.respuesta}`, 'success');
          this.getAllDishes();
          const index = this.dishes.findIndex(d => d.id === response.respuesta.id);
          if (index !== -1) {
            this.dishes[index] = response.respuesta;
            this.onSearch();
          }
          this.showEditModal = false;
        } else {
          showAlert('❌ Error al editar el plato.', 'error');
        }
      },
      error: (err) => {
        showAlert('Error en la actualización: ' + err.message, 'error');
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
