import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishDto } from '../../dto/dishdto';
import { DishDetailDto } from '../../dto/dishDetailDto';


@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})
export class MenuCardComponent {
  @Input() dish!: DishDto;
  @Output() viewDetail = new EventEmitter<DishDto>();

  onCardClick() {
  this.viewDetail.emit(this.dish);
  }
  onEdit() {
    console.log('Editar:', this.dish);
  }

  onDelete() {
    console.log('Eliminar:', this.dish);
  }
}
