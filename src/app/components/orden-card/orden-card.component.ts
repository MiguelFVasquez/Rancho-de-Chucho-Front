import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input,Output } from '@angular/core';
import { ordenReadDto } from '../../dto/order/orderReadDto';
import { estado } from '../../dto/order/orderEnum';

@Component({
  selector: 'app-orden-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orden-card.component.html',
  styleUrl: './orden-card.component.css'
})
export class OrdenCardComponent {
  @Input() orden!: ordenReadDto;
  @Input() context: 'mesero' | 'staff' = 'mesero';  //Contexto para saber cual modal mostrar
  @Output() verDetalles = new EventEmitter<any>();
  
  
  

  abrirDetalles() {
    this.verDetalles.emit(this.orden);
  }

}
