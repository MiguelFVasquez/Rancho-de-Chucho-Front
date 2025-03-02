import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';
import { editProduct } from '../../dto/product/editProductDto';
import { InventoryService } from '../../services/product-service.service';
import { MessageDTO } from '../../dto/messageDto';
import { NewProduct } from '../../dto/product/newProductDto';

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
    // Check if the form is valid before proceeding.
    if (this.productForm.valid) {
        // Get the form values and assign them to a new product object.
        const newProduct: NewProduct = this.productForm.value;

        // Call the inventory service to save the new product.
        this.inventoryService.saveProduct(newProduct).subscribe({
            // Handle the response from the server.
            next: (response: MessageDTO) => {
                // Check if the product was successfully created.
                if (response.status) {
                    // Log the success message with the product ID.
                    console.log(`Product created with ID: ${response.message}`);
                    // Close the modal after successful creation.
                    this.showModal = false;
                } else {
                    // Log an error message if the product creation failed.
                    console.error('Error creating product.');
                }
            },
            // Handle any errors that occur during the request.
            error: (error) => {
                // Log the server error.
                console.error('Server error:', error);
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
    // Check if a product is selected for editing.
    if (this.selectedProduct) {
        // Get the ID of the selected product.
        const id = this.selectedProduct.id;

        // Call the inventory service to update the product with the new data.
        this.inventoryService.editProduct(id, this.editProductData).subscribe({
            // Handle the response from the server.
            next: (response: MessageDTO) => {
                // Check if the product was successfully updated on the backend.
                if (response.status) {
                    // Find the index of the product in the local array.
                    const index = this.products.findIndex(p => p.id === id);
                    
                    // If the product is found in the local array, update it with the new data.
                    if (index !== -1) {
                        // Merge the existing product data with the edited data.
                        this.products[index] = { ...this.products[index], ...this.editProductData };
                    }

                    // Close the edit modal after successful update.
                    this.showEditModal = false;

                    // Reset the selected product to null to clear the selection.
                    this.selectedProduct = null;
                } else {
                    // Log an error message if the product update failed.
                    console.error('Error updating product.');
                }
            },
            // Handle any errors that occur during the request.
            error: (error) => {
                // Log the server error.
                console.error('Server error:', error);
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
    // Check if a product is selected for deletion.
    if (this.selectedProduct) {
        // Get the ID of the selected product.
        const id = this.selectedProduct.id;

        // Call the inventory service to delete the product from the backend.
        this.inventoryService.deleteProduct(id).subscribe({
            // Handle the response from the server.
            next: (response: MessageDTO) => {
                // Check if the product was successfully deleted on the backend.
                if (response.status) {
                    // Remove the product from the local array (`this.products`) by filtering it out.
                    this.products = this.products.filter(product => product.id !== id);

                    // Reset the selected product to null to clear the selection.
                    this.selectedProduct = null;

                    // Close the delete modal after successful deletion.
                    this.showDeleteModal = false;
                } else {
                    // Log an error message if the product deletion failed.
                    console.error('Error deleting product.');
                }
            },
            // Handle any errors that occur during the request.
            error: (error) => {
                // Log the server error.
                console.error('Server error:', error);
            }
        });
    }
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

}
