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

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, InventoryTableComponent,ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

  searchTerm: string = '';
  selectedProduct: productDto | null = null;  // Antes era any
  productForm: FormGroup;
  showModal: boolean = false;  
  showEditModal: boolean = false;
  showDeleteModal: boolean = false; 
  selectedStockProduct?: productDto;
  stockQuantity: number = 1;
  showStockModal = false;
  //Alert
  alertMessage: string = '';
  alertType: 'success' | 'error' | '' = ''; // Define el tipo de alerta
  editProductData: editProduct = {
    id:0,
    nombre: '',
    marca: '',
    precioCompra: 0,
    unidadMedida: ''
  };

  products = [
    { id: 2, nombre: 'Azúcar', precioCompra: 1.8, marca: 'Manuelita', cantidadDisponible: 15, unidadMedida: 'kg' },
    { id: 1, nombre: 'Harina', precioCompra: 2.5, marca: 'Maizena', cantidadDisponible: 20, unidadMedida: "Kg" },
    { id: 3, nombre: 'Aceite', precioCompra: 3.0, marca: 'Girasol', cantidadDisponible: 10, unidadMedida: 'lt' },
    { id: 4, nombre: 'Leche', precioCompra: 1.2, marca: 'Colanta', cantidadDisponible: 30, unidadMedida: 'lt' }
  ];


  constructor(private fb: FormBuilder, private inventoryService: InventoryService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      marca: ['', Validators.required],
      precio_compra: [0, [Validators.required, Validators.min(0.1)]],
      cantidad_disponible: [0, [Validators.required, Validators.min(1)]],
      unidad_medida: ['', Validators.required]
    });
  }

  get filteredProducts() {
    return this.products.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearch() {
    console.log(`Buscando: ${this.searchTerm}`);
  }
  onRowSelected(product: any) {
    this.selectedProduct = product;
    console.log('Producto seleccionado:', product);
  } 

 
  //---------ADD MODAL--------------
  //Open a form to register the info
  onAddProduct() {
    this.showModal = true;
    this.productForm.reset();
  }

  addProduct() {
    if (this.productForm.valid) {
      const newProduct: NewProduct = this.productForm.value;
      this.inventoryService.saveProduct(newProduct).subscribe({
        next: (response: MessageDTO) => {
          if (response.status) {
            this.showModal = false;
            showAlert(`Producto agregado con ID: ${response.message}`, 'success');
          } else {
            showAlert('Error al agregar el producto.', 'error');
          }
        },
        error: () => {
          showAlert('Error de servidor al agregar el producto.', 'error');
        }
      });
    }
  }
//-------EDIT MODAL--------------  
  openEditModal() {
    if (this.selectedProduct) {
      this.editProductData = { ...this.selectedProduct };
      this.showEditModal = true;
    }
  }
// Esta función guarda el producto editado y actualiza la lista
  saveEditedProduct() {
    if (this.selectedProduct) {
      const id = this.selectedProduct.id;
      this.inventoryService.editProduct(id, this.editProductData).subscribe({
        next: (response: MessageDTO) => {
          if (response.status) {
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
              this.products[index] = { ...this.products[index], ...this.editProductData };
            }
            this.showEditModal = false;
            showAlert('Producto actualizado correctamente.', 'success');
          } else {
            showAlert('Error al actualizar el producto.', 'error');
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
          if (response.status) {
            this.products = this.products.filter(product => product.id !== id);
            this.selectedProduct = null;
            this.showDeleteModal = false;
            showAlert('Producto eliminado correctamente.', 'success');
          } else {
            showAlert('Error al eliminar el producto.', 'error');
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
            if (response.status) {  
              this.selectedStockProduct!.cantidadDisponible += this.stockQuantity;
              showAlert('Stock actualizado correctamente.', 'success');
            } else {
              showAlert('Error al actualizar stock.', 'error');
            }
            this.closeStockModal();
          },
          error: () => {
            showAlert('Error en la solicitud al actualizar stock.', 'error');
            this.closeStockModal();
          }
        });
    }
  }
}
