import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input,Output } from '@angular/core';
import { ordenReadDto } from '../../dto/order/orderReadDto';

@Component({
  selector: 'app-orden-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orden-card.component.html',
  styleUrl: './orden-card.component.css'
})
export class OrdenCardComponent {
  @Input() orden!: ordenReadDto;
  @Output() verDetalles = new EventEmitter<any>();
  
  abrirDetalles() {
    this.verDetalles.emit(this.orden);
  }
}
