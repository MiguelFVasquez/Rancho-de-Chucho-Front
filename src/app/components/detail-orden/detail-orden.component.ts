import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platoReadDto } from '../../dto/dish/dishdto';
import { PlatoService } from '../../services/plato.service';
import { OrderService } from '../../services/order.service'; 
import { MessageDTO } from '../../dto/messageDto';
import { FormsModule } from '@angular/forms';
import { ordenReadDto } from '../../dto/order/orderReadDto';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './detail-orden.component.html',
  styleUrl: './detail-orden.component.css'
})
export class DetailOrderComponent {
  @Input() orden!: ordenReadDto; // Ahora está tipado correctamente
  @Output() cerrarDetalle = new EventEmitter<void>(); // Evento para cerrar modal
  @Output() ordenCancelada = new EventEmitter<number>(); // o el tipo que uses para el ID

  mostrarModalEdicion: boolean = false;
  ordenEnEdicion: any = null;

  // Platillos
  dishes: platoReadDto[] = [];
  platillosSeleccionados: { nombre: string; cantidad: number }[] = [];
  errores: string[] = [];

  constructor(private platoService: PlatoService,  private orderService: OrderService) {}

  // Obtener todos los platos disponibles
  getAllDishes(): void {
    this.platoService.getAllDishs().subscribe({
      next: (response: MessageDTO<platoReadDto[]>) => {
        if (!response.error) {
          this.dishes = response.respuesta;
        } else {
          console.error('Error obteniendo platos:', response);
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
      },
    });
  }


  // Método para abrir el modal de edición
  editarOrden() {
    this.ordenEnEdicion = { ...this.orden }; // Clonamos la orden actual
    this.getAllDishes(); // Traemos la lista de platos disponibles
    this.mostrarModalEdicion = true; // Abrimos el modal de edición
    console.log("Se cierra uno y el otro no abre")
  }


  // Cerrar el modal de edición
  cerrarModalEdicion() {
    this.mostrarModalEdicion = false;
    this.ordenEnEdicion = null;
  }

  // Confirmar la edición de la orden
  confirmarEdicionOrden() {
    console.log('Orden editada:', this.ordenEnEdicion);
    // Aquí enviarías la actualización al backend (aún no implementado)
    this.cerrarModalEdicion();
  }

  // -----Validaciones-----
  validarCantidad(index: number) {
    let cantidad = this.platillosSeleccionados[index].cantidad;
  
    // Si la cantidad es menor que 1 o no es un número, establecer 1 por defecto
    if (!cantidad || isNaN(cantidad) || cantidad < 1) {
      this.platillosSeleccionados[index].cantidad = 1;
    }
  }

  validarTecla(event: KeyboardEvent) {
    const teclaPresionada = event.key;
  
    // Permitir solo números del 0 al 9
    if (!/^\d$/.test(teclaPresionada)) {
      event.preventDefault();
    }
  }

  // -----Evento para cancelar la orden, se emite el evento para el componente padre
  cancelarOrden() {
    const confirmacion = window.confirm('¿Seguro que desea cancelar la orden?');
  
    if (confirmacion) {
      this.orderService.cancelarOrden(this.orden.idOrden).subscribe({
        next: (response) => {
          if (!response.error) {
            alert('Orden cancelada exitosamente.');
            this.orden.estadoOrden = 'CANCELADA'; // Refleja el cambio en el front
            this.cerrar(); // Opcional: cerrar modal automáticamente
          } else {
            alert(`No se pudo cancelar: ${response.mensaje}`);
          }
        },
        error: (error) => {
          console.error('Error al cancelar la orden:', error);
          alert('Ocurrió un error al intentar cancelar la orden.');
        }
      });
    }
  }
  



  //Agrega el platillo a la orden
  agregarPlatillo() {
    this.platillosSeleccionados.push({ nombre: "", cantidad: 1 });
  }
  //Elimina el platillo de la orden
  eliminarPlatillo(index: number) {
    this.platillosSeleccionados.splice(index, 1);
  }
  
  cerrar() {
    this.cerrarDetalle.emit(); // Emite evento para cerrar modal
  }
}
