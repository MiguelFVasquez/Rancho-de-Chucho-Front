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

  products = [
    { id: 1, nombre: 'Harina', precioPorUnidad: 2.5, marca: 'Maizena', cantidad: 20, unidad: 'kg' },
    { id: 2, nombre: 'Azúcar', precioPorUnidad: 1.8, marca: 'Manuelita', cantidad: 15, unidad: 'kg' },
    { id: 3, nombre: 'Aceite', precioPorUnidad: 3.0, marca: 'Girasol', cantidad: 10, unidad: 'lt' },
    { id: 4, nombre: 'Leche', precioPorUnidad: 1.2, marca: 'Colanta', cantidad: 30, unidad: 'lt' }
  ];

  get filteredProducts() {
    return this.products.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearch() {
    // Método agregado para manejar el evento si se necesita lógica extra
    console.log(`Buscando: ${this.searchTerm}`);
  }
}
