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
  @Output() ordenCancelada = new EventEmitter<number>(); // o el tipo que uses para el ID

  editarOrden() {
    console.log('Editar orden:', this.orden);
    // Aquí podrías emitir un evento o cambiar a modo edición
  }


  /**
   * Evento para cancelar la orden, se emite el evento para el componente padre
   */
  cancelarOrden() {
    const confirmacion = window.confirm('¿Seguro que desea cancelar la orden?');
  
    if (confirmacion) {
      this.ordenCancelada.emit(this.orden.id);
    }
  }
  
  
  cerrar() {
    this.cerrarDetalle.emit(); // Emite evento para cerrar modal
  }
}
