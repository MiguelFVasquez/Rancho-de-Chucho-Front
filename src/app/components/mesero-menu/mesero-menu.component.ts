import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mesero-menu',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mesero-menu.component.html',
  styleUrl: './mesero-menu.component.css'
})
export class MeseroMenuComponent {
  searchTerm: string = '';
  selectedCategory: string = '';

  categories: string[] = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas']; //Categorias momentaneas tambien
  
  //Platillos (Son solo datos de prueba para visualización previa a conexión)
  dishes = [
    { name: 'Hamburguesa', description: 'Carne de res con queso y vegetales', price: 25.000, available: true, category: 'Platos Fuertes' },
    { name: 'Pizza', description: 'Pizza con pepperoni y queso', price: 30.000, available: false, category: 'Platos Fuertes' },
    { name: 'Brownie', description: 'Brownie con helado de vainilla', price: 15.000, available: true, category: 'Postres' },
    { name: 'Jugo de Mango', description: 'Jugo natural de mango', price: 8.000, available: true, category: 'Bebidas' }
  ];

  // Filtrar platillos por categoría y búsqueda
  filteredDishes() {
    return this.dishes.filter(dish => {
      const matchesSearch = this.searchTerm === '' || dish.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || dish.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}
