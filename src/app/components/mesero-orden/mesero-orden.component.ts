import { Component } from '@angular/core';
import { OrdenCardComponent } from '../orden-card/orden-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mesero-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, OrdenCardComponent],
  templateUrl: './mesero-orden.component.html',
  styleUrl: './mesero-orden.component.css'
})
export class MeseroOrdenComponent {
  ordenes:any = [{ id: 1, mesa: "Mesa 1", estado: "En proceso", platillos: [{ nombre: "Tacos", cantidad: 2 }] },
  { id: 2, mesa: "Mesa 2", estado: "Pendiente", platillos: [{ nombre: "Burritos", cantidad: 1 }] },
  { id: 3, mesa: "Mesa 3", estado: "En proceso", platillos: [{ nombre: "Enchiladas", cantidad: 3 }] },
  { id: 4, mesa: "Mesa 4", estado: "Pendiente", platillos: [{ nombre: "Quesadillas", cantidad: 2 }] },
  { id: 5, mesa: "Mesa 5", estado: "En proceso", platillos: [{ nombre: "Tostadas", cantidad: 1 }] }];

  mostrarModal = false;
  platillosSeleccionados: { nombre: string; cantidad: number }[] = [];
  paginaActual = 0;
  ordenesPorPagina = 4;

  abrirModal() {
    this.mostrarModal = true;
    this.platillosSeleccionados = [];
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  agregarPlatillo() {
    this.platillosSeleccionados.push({ nombre: "", cantidad: 1 });
  }

  eliminarPlatillo(index: number) {
    this.platillosSeleccionados.splice(index, 1);
  }

  confirmarOrden() {
    if (this.platillosSeleccionados.length > 0) {
      const nuevaOrden = {
        id: this.ordenes.length + 1,
        mesa: `Mesa ${this.ordenes.length + 1}`,
        estado: "En proceso",
        platillos: [...this.platillosSeleccionados]
      };
      this.ordenes.push(nuevaOrden);
      this.cerrarModal();
    }
  }

  get ordenesPaginadas() {
    const inicio = this.paginaActual * this.ordenesPorPagina;
    return this.ordenes.slice(inicio, inicio + this.ordenesPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ordenes.length / this.ordenesPorPagina);
  }

  avanzarPagina() {
    if (this.paginaActual + 1 < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  retrocederPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }
}
