import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishDto } from '../../dto/dishdto';


@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})
export class MenuCardComponent {
  @Input() dish!: DishDto;

  onEdit() {
    console.log('Editar:', this.dish);
  }

  onDelete() {
    console.log('Eliminar:', this.dish);
  }
}
