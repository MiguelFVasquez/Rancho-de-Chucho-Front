import { Component, OnInit } from '@angular/core';
import { OrdenCardComponent } from '../orden-card/orden-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ordenReadDto } from '../../dto/order/orderReadDto';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-staff-orden',
  standalone: true,
  imports: [OrdenCardComponent,CommonModule],
  templateUrl: './staff-orden.component.html',
  styleUrl: './staff-orden.component.css'
})
export class StaffOrdenComponent implements OnInit{
  //Orders
  ordenes:ordenReadDto[]=[]
  ordenSeleccionada: any = null;
   //status order
  ordenesPorEstado: { [estado: string]: any[] } = {};
  estadosPermitidos: string[] = ['ESPERANDO', 'PROCESO']; 
  //Pagination
  paginaActual = 0;
  ordenesPorPagina = 4;
  totalPaginas: number = 0;
  constructor(private orderService:OrderService){}

    ngOnInit(): void {
    this.getAllOrders();
  }


  agruparOrdenesPorEstado() {
    this.ordenesPorEstado = this.ordenes.reduce((resultado, orden) => {
      const estado = orden.estadoOrden || 'SIN_ESTADO';
      if (!resultado[estado]) {
        resultado[estado] = [];
      }
      resultado[estado].push(orden);
      return resultado;
    }, {} as { [estado: string]: any[] });
  }
    //Method to get all state orden
  getEstadosOrdenados(): string[] {
    return Object.keys(this.ordenesPorEstado).sort();
  }
  
      //Method to get all orders
  getAllOrders(): void {
    this.orderService.getAllOrders(this.paginaActual, this.ordenesPorPagina).subscribe({
      next: (response) => {
        if (response && response.ordenes) {
          this.ordenes = response.ordenes;
          this.totalPaginas = response.totalPages;
          this.agruparOrdenesPorEstado(); // Si estás agrupando por estado
        } else {
          console.error('Respuesta inválida del servidor');
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
      }
    });
  }

//Order filters
tieneOrdenesPermitidas(): boolean {
  return this.estadosPermitidos.some(
    estado => this.ordenesPorEstado[estado]?.length > 0
  );
}


  avanzarPagina() {
    if (this.paginaActual + 1 < this.totalPaginas) {
      this.paginaActual++;
      this.getAllOrders(); // cargar siguiente página
    }
  }

  retrocederPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.getAllOrders(); // cargar página anterior
    }
  }

}
