import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { productDto } from '../../dto/product/productDto';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-table.component.html',
  styleUrl: './inventory-table.component.css'
})
export class InventoryTableComponent {
  @Input() products: productDto[] = [];
  @Output() rowSelected = new EventEmitter<productDto>();
  @Output() stockAdded = new EventEmitter<productDto>();

  selectedProduct: productDto | null = null;

  
  selectProduct(product: productDto): void {
    this.selectedProduct = product;
    this.rowSelected.emit(product);
  }

  addStock(product: productDto, event: Event): void {
    event.stopPropagation(); // Evita que se seleccione la fila al hacer clic en el botón
    this.stockAdded.emit(product);
  }
}
