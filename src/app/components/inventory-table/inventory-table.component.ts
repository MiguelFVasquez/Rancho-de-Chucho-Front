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

  selectedProduct?: productDto;

  selectProduct(product: productDto): void {
    this.selectedProduct = product;
    this.rowSelected.emit(product);
  }
}
