import { Component } from '@angular/core';
import { OrdenCardComponent } from '../orden-card/orden-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { showAlert } from '../../dto/alert';
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

  errores: string[] = [];
  //Simulación del menú.
  menuPlatos = [
    { nombre: "Tacos al Pastor" },
    { nombre: "Burritos de Res" },
    { nombre: "Enchiladas Verdes" },
    { nombre: "Quesadillas de Queso" },
    { nombre: "Sopes con Carne" }
  ];

  //Abre el dialogo para crear una nueva orden-
  abrirModal() {
    this.mostrarModal = true;
    this.platillosSeleccionados = [];
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
  //Agrega los campos para seleccionar un platillo, al igual que la cantidad. 
  agregarPlatillo() {
    this.platillosSeleccionados.push({ nombre: "", cantidad: 1 });
  }
  //Elimina el platillo de la orden
  eliminarPlatillo(index: number) {
    this.platillosSeleccionados.splice(index, 1);
  }


  //Función que crea la orden 
  confirmarOrden() {
    // Verificar que al menos un platillo fue seleccionado
    if (this.platillosSeleccionados.length === 0) {
      alert("Debe agregar al menos un platillo.");
      return;
    }
  
    // Verificar que todas las cantidades sean válidas
    for (let platillo of this.platillosSeleccionados) {
      if (!platillo.cantidad || platillo.cantidad <= 0) {
        alert(`La cantidad de "${platillo.nombre}" debe ser mayor a 0.`);
        return;
      }
    }
  
    // Si las validaciones pasan, agregar la orden
    const nuevaOrden = {
      id: this.ordenes.length + 1,
      mesa: `Mesa ${this.ordenes.length + 1}`,
      estado: "En proceso",
      platillos: [...this.platillosSeleccionados]
    };
    this.ordenes.push(nuevaOrden);
    showAlert(`✅ Orden creada con éxito`, 'success');
    this.cerrarModal();
  }
  
//-----------Función para validar que los valores ingresados en la cantidad sean datos validos.-----
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
  
//-----------PAGINACIÓN DE LAS ORDENES-----------
  
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
