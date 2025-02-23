import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from '../menu-card/menu-card.component';
import { DishDto } from '../../dto/dishdto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuCardComponent, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  dishes: DishDto[] = [
    { id: 1, name: 'Tacos al Pastor', price: 25000, image: 'tacosP.png' },
    { id: 2, name: 'Frijoles con chicharron', price: 22000, image: 'frijoles.png' },
    { id: 3, name: 'Sancocho', price: 18000, image: 'sancocho.png' },
    { id: 4, name: 'Bandeja paisa', price: 20000, image: 'bandeja.png' },
    { id: 5, name: 'Empanadas', price: 12000, image: 'empanadas.png' },
  ];
  filteredDishes: DishDto[] = [...this.dishes];
  paginatedDishes: DishDto[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;

  constructor() {
    this.updatePagination();
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDishes = this.dishes.filter((dish) =>
      dish.name.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

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

  onEditDish(dish: DishDto) {
    console.log('Editar platillo:', dish);
  }

  onDeleteDish(dish: DishDto) {
    this.dishes = this.dishes.filter((d) => d.id !== dish.id);
    this.onSearch(); // Actualizar filtrado y paginación tras eliminar
  }
}
