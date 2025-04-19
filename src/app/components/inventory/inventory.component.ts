import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';
import { editProduct } from '../../dto/product/editProductDto';
import { InventoryService } from '../../services/product-service.service';
import { MessageDTO } from '../../dto/messageDto';
import { NewProduct } from '../../dto/product/newProductDto';
import { productDto } from '../../dto/product/productDto';
import { showAlert } from '../../dto/alert';
import { units } from '../../dto/product/units';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, InventoryTableComponent,ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

  searchTerm: string = '';
  selectedProduct: productDto | null = null;
  productForm: FormGroup;
  showModal: boolean = false;  
  showEditModal: boolean = false; //edit modal
  showDeleteModal: boolean = false; //delete modal
  selectedStockProduct?: productDto;
  stockQuantity: number = 1;
  showStockModal = false; 
  showHelpModal: boolean = false; //Help modal

  editProductData: editProduct = {
    id:0,
    nombre: '',
    marca: '',
    precioCompra: 0,
    unidad_medida: ''
  };

  products: productDto[]=[];
  units: units[]=[];

  constructor(private fb: FormBuilder, private inventoryService: InventoryService) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      precioCompra: [0, [Validators.required, Validators.min(0.1)]],
      cantidadDisponible: [0, [Validators.required, Validators.min(1)]],
      unidad_medida: ['', Validators.required]
    });
  }
  ngOnInit(): void{
    this.loadProducts();
  }

  //GET ALL PRODUCTS-
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

  //Get all units 
  getAllUnits():void{
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
  
  //Filtro de busqueda
  get filteredProducts() {
    return this.products ? this.products.filter(
      product =>
        product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      ):[];
  }
  

  onSearch() {
    console.log(`Buscando: ${this.searchTerm}`);
  }
  onRowSelected(product: productDto) {
    this.selectedProduct = product;

  } 

 
  //---------ADD MODAL--------------
  //Open a form to register the info
  onAddProduct() {
    this.showModal = true;
    this.productForm.reset();
    this.getAllUnits();
  }

  addProduct() {
    if (this.productForm.valid) {
      const newProduct: NewProduct = {
        nombre: this.productForm.value.nombre,
        marca: this.productForm.value.marca,
        precioCompra: Number(this.productForm.value.precioCompra.toFixed(2)+0.0),
        cantidadDisponible: this.productForm.value.cantidadDisponible,
        unidad_medida: this.productForm.value.unidad_medida 
      };
  
      console.log("📤 Enviando al backend:", JSON.stringify(newProduct));
  
      this.inventoryService.saveProduct(newProduct).subscribe({
        next: (response: MessageDTO) => {
          console.log("✅ Respuesta del backend:", response);

          // Invertimos la lógica, ahora 'error: true' significa éxito
          if (!response.error) {
            this.showModal = false;
            showAlert(`✅ Producto agregado con ID: ${response.respuesta}`, 'success');
            this.loadProducts();
          } else {
            showAlert('❌ Error al agregar el producto.', 'error');
          }
        },
        error: (err) => {
          console.error("Error en la petición:", err);
          console.error("Respuesta detallada del backend:", err.error);
  
          if (err.status === 400 && typeof err.error === 'object') {
            const validationErrors = Object.entries(err.error)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            showAlert(`⚠️ Errores de validación:\n${validationErrors}`, 'error');
          } else {
            showAlert(`Error de servidor: ${err.error.message || 'Desconocido'}`, 'error');
          }
        }
      });
    }
}

  
  
//-------EDIT MODAL--------------  
  openEditModal() {
    if (this.selectedProduct) {
      this.editProductData = { ...this.selectedProduct };
      this.showEditModal = true;
      this.getAllUnits();
    }
  }
// Esta función guarda el producto editado y actualiza la lista
  saveEditedProduct() {
    if (this.selectedProduct) {
      const id = this.selectedProduct.id;
      this.selectedProduct.unidad_medida= this.productForm.value.unidad_medida 
      this.inventoryService.editProduct(id, this.editProductData).subscribe({
        next: (response: MessageDTO) => {
          if (response.error) {
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
              this.products[index] = { ...this.products[index], ...this.editProductData };
            }
            this.showEditModal = false;
            this.loadProducts();
            showAlert('✅ Producto actualizado correctamente.', 'success');
          } else {
            showAlert('❌ Error al actualizar el producto.', 'error');
          }
        },
        error: () => {
          showAlert('Error de servidor al actualizar el producto.', 'error');
        }
      });
    }
  }

  closeEditModal() {
    this.showEditModal = false;
  }
//---DELETE MODAL----------
  openDeleteModal() {
    if (this.selectedProduct) {
      this.showDeleteModal = true;
    }
  }

  // Esta función confirma la eliminación de un producto
  confirmDelete() {
    if (this.selectedProduct) {
      const id = this.selectedProduct.id;
      this.inventoryService.deleteProduct(id).subscribe({
        next: (response: MessageDTO) => {
          if (response.error) {
            this.products = this.products.filter(product => product.id !== id);
            this.selectedProduct = null;
            this.showDeleteModal = false;
            showAlert('✅ Producto eliminado correctamente.', 'success');
            this.loadProducts();
          } else {
            showAlert('❌ Error al eliminar el producto.', 'error');
          }
        },
        error: () => {
          showAlert('Error de servidor al eliminar el producto.', 'error');
        }
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }
  //-------STOCK MODAL--------

  // Recibe el evento desde la tabla y abre el modal
  openStockModal(product: productDto): void {
    this.selectedStockProduct = product;
    this.stockQuantity = 1;
    this.showStockModal = true;
  }

  // Cierra el modal sin hacer cambios
  closeStockModal(): void {
    this.showStockModal = false;
  }

  // Confirma la adición de stock
  confirmAddStock(): void {
    if (this.selectedStockProduct && this.stockQuantity > 0) {
      this.inventoryService.addToStock(this.selectedStockProduct.id, this.stockQuantity)
        .subscribe({
          next: (response) => {
            if (response.error) {  
              this.selectedStockProduct!.cantidadDisponible += this.stockQuantity;
              showAlert(' ✅ Stock actualizado correctamente.', 'success');
            } else {
              showAlert('❌ Error al actualizar stock.', 'error');
            }
            this.closeStockModal();
            this.loadProducts();
          },
          error: () => {
            showAlert('Error en la solicitud al actualizar stock.', 'error');
            this.closeStockModal();
          }
        });
    }
  }

  /*HELP MODAL*/
  openHelpModal() {
    this.showHelpModal = true;
  }
  closeHelpModal() {
    this.showHelpModal = false;
  }
}
