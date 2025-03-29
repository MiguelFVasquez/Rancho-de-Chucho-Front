import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-orden.component.html',
  styleUrl: './detail-orden.component.css'
})
export class DetailOrderComponent {
  @Input() orden: any;  // Recibe la orden a mostrar
  @Output() cerrarDetalle = new EventEmitter<void>(); // Evento para cerrar modal

  cerrar() {
    this.cerrarDetalle.emit(); // Emite evento para cerrar modal
  }
}
