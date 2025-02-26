import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, InventoryTableComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  searchTerm: string = '';
  selectedProduct: any = null;

  products = [
    { id: 1, name: 'Harina', precio_compra: 2.5, marca: 'Maizena', cantidad_disponible: 20, unidad_medida: "Kg" },
    { id: 2, name: 'Azúcar', precio_compra: 1.8, marca: 'Manuelita', cantidad_disponible: 15, unidad_medida: 'kg' },
    { id: 3, name: 'Aceite', precio_compra: 3.0, marca: 'Girasol', cantidad_disponible: 10, unidad_medida: 'lt' },
    { id: 4, name: 'Leche', precio_compra: 1.2, marca: 'Colanta', cantidad_disponible: 30, unidad_medida: 'lt' }
  ];

  get filteredProducts() {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearch() {
    console.log(`Buscando: ${this.searchTerm}`);
  }

  onAddProduct() {
    console.log('Agregar producto');
    // Aquí puedes abrir un diálogo o formulario para agregar un producto
  }

  onRowSelected(product: any) {
    this.selectedProduct = product;
    console.log('Producto seleccionado:', product);
  }

  onEditProduct() {
    if (this.selectedProduct) {
      console.log('Editar producto:', this.selectedProduct);
      // Lógica para editar el producto seleccionado
    }
  }

  onDeleteProduct() {
    if (this.selectedProduct) {
      console.log('Eliminar producto:', this.selectedProduct);
      this.products = this.products.filter(product => product.id !== this.selectedProduct.id);
      this.selectedProduct = null;
    }
  }
}
