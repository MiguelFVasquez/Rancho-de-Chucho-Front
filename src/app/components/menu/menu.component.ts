import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from '../menu-card/menu-card.component';
import { DishDto } from '../../dto/dishdto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuCardComponent,FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  dishes: DishDto[] = [
    { id: 1, name: 'Tacos al Pastor', price: 25000, image: 'tacosP.png' },
    { id: 2, name: 'Frijoles con chicharron', price: 22000, image: 'frijoles.png' },
    { id: 3, name: 'Sancocho', price: 18000, image: 'sancocho.png' },
    { id: 4, name: 'Bandeja paisa', price: 20000, image: 'bandeja.png' }
  ];
  filteredDishes: DishDto[] = [...this.dishes];
  searchTerm: string = '';

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDishes = this.dishes.filter(dish =>
      dish.name.toLowerCase().includes(term)
    );
  }


  onEditDish(dish: any) {
    console.log('Editar platillo:', dish);
    // Lógica para editar el platillo
  }

  // 🗑️ Maneja la eliminación del platillo
  onDeleteDish(dish: any) {
    console.log('Eliminar platillo:', dish);
    this.dishes = this.dishes.filter(d => d.id !== dish.id);
  }

}
