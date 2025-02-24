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
    { id: 1, name: 'Tacos al Pastor', price: 25000, image: 'tacosP.png', category: 'Platos Fuertes' },
    { id: 2, name: 'Frijoles con chicharron', price: 22000, image: 'frijoles.png', category: 'Platos Fuertes' },
    { id: 3, name: 'Sancocho', price: 18000, image: 'sancocho.png', category: 'Platos Fuertes' },
    { id: 4, name: 'Bandeja paisa', price: 20000, image: 'bandeja.png', category: 'Platos Fuertes' },
    { id: 5, name: 'Empanadas', price: 12000, image: 'empanadas.png', category: 'Snack' },
    { id: 6, name: 'Arroz con leche', price: 8000, image: 'arrozConLeche.png', category: 'Postres' },
  ];
  categories: string[] = ['Platos Fuertes', 'Bebidas', 'Snack', 'Postres'];
  selectedCategory: string = '';
  filteredDishes: DishDto[] = [...this.dishes];
  paginatedDishes: DishDto[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  showCategoryDialog: boolean = false;

  constructor() {
    this.updatePagination();
  }

  openCategoryDialog(): void {
    this.showCategoryDialog = true;
  }

  closeCategoryDialog(): void {
    this.showCategoryDialog = false;
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.showCategoryDialog = false;
    this.onSearch();
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDishes = this.dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(term) &&
        (this.selectedCategory ? dish.category === this.selectedCategory : true)
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

  onEditDish(dish: DishDto): void {
    console.log('Editar platillo:', dish);
  }

  onDeleteDish(dish: DishDto): void {
    this.dishes = this.dishes.filter((d) => d.id !== dish.id);
    this.onSearch(); // Actualizar filtrado y paginación tras eliminar
  }
}
