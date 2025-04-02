import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishDetailDto } from '../../dto/dish/dishDetailDto';
import { platoReadDto } from '../../dto/dish/dishdto';


@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.css'
})
export class MenuDetailComponent {
  @Input() selectedDish!: DishDetailDto;
  @Output() closeDetail = new EventEmitter<void>();

  closeDetailView() {
    this.closeDetail.emit(); 
  }
  
}
