import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platoReadDto } from '../../dto/dish/dishdto';
import { DishDetailDto } from '../../dto/dish/dishDetailDto';


@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})

export class MenuCardComponent {
  @Input() dish!: platoReadDto;
  @Output() editDish = new EventEmitter<platoReadDto>();
  @Output() deleteDish = new EventEmitter<platoReadDto>();
  @Output() viewDetail = new EventEmitter<platoReadDto>();


  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.editDish.emit(this.dish); // se emite el dish
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.deleteDish.emit(this.dish);
  }

  onCardClick() {
    this.viewDetail.emit(this.dish);
  }

}
