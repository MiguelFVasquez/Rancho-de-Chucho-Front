import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';
import { editProduct } from '../../dto/product/editProductDto';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, InventoryTableComponent,ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  searchTerm: string = '';
  selectedProduct: any = null;
  productForm: FormGroup;
  showModal: boolean = false;  
  showEditModal: boolean = false;
  showDeleteModal: boolean = false; 
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


  constructor(private fb: FormBuilder) {
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
  //Open a form to register the info
  onAddProduct() {
    this.showModal = true;
    this.productForm.reset();
  }

  // Agrega el producto a la lista y cierra el modal
  addProduct() {
    if (this.productForm.valid) {
      this.products.push(this.productForm.value);
      this.showModal = false;
    }
  }

  onRowSelected(product: any) {
    this.selectedProduct = product;
    console.log('Producto seleccionado:', product);
  } 
//-------EDIT MODAL--------------  
  openEditModal() {
    if (this.selectedProduct) {
      this.editProductData = { ...this.selectedProduct };
      this.showEditModal = true;
    }
  }
  saveEditedProduct() {
    if (this.selectedProduct) {
      const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...this.editProductData };
      }
      this.showEditModal = false;
      this.selectedProduct = null;
    }
  }

  closeEditModal() {
    this.showEditModal = false;
  }
//---------
  openDeleteModal() {
    if (this.selectedProduct) {
      this.showDeleteModal = true;
    }
  }

  confirmDelete() {
    if (this.selectedProduct) {
      this.products = this.products.filter(product => product.id !== this.selectedProduct.id);
      this.selectedProduct = null;
      this.showDeleteModal = false;
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

}
