import { Component } from '@angular/core';
import { OrdenCardComponent } from '../orden-card/orden-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { showAlert } from '../../dto/alert';
import { DetailOrderComponent } from '../detail-orden/detail-orden.component';
import { platoReadDto } from '../../dto/dish/dishdto';
import { PlatoService } from '../../services/plato.service';
import { MessageDTO } from '../../dto/messageDto';
import { ordenReadDto } from '../../dto/order/orderReadDto';
import { OrderService } from '../../services/order.service';
import { Message } from '../../dto/message';
import { PlatilloCantidadDTO, OrdenCreateDto } from '../../dto/order/createOrderDto';
import { PlatilloSeleccionado } from '../../dto/order/dishSelected';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-mesero-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, OrdenCardComponent, DetailOrderComponent],
  templateUrl: './mesero-orden.component.html',
  styleUrl: './mesero-orden.component.css'
})
export class MeseroOrdenComponent {

  ordenes:ordenReadDto[]=[]
  mostrarModal = false;
  platillosSeleccionados: PlatilloSeleccionado[] = [];
  paginaActual = 0;
  ordenesPorPagina = 4;
  totalPaginas: number = 0;
 
  ordenSeleccionada: any = null;
  errores: string[] = [];

  //status order
  ordenesPorEstado: { [estado: string]: any[] } = {};
  //Platillos
  dishes: platoReadDto[] = [];
  dishesActivos: platoReadDto[] = [];
  //to new order
  mesaSeleccionada: number | null = null;
  mesasDisponibles: { id: string, nombre: string }[] = [
    { id: "1", nombre: "Mesa 1" },
    { id: "2", nombre: "Mesa 2" },
    { id: "3", nombre: "Mesa 3" },
    { id: "4", nombre: "Mesa 4" }
  ];
  errorMesa: string = "";
  cedulaMesero = '1111';

  constructor(
    private platoService: PlatoService, 
    private orderService:OrderService,
    private storageService:StorageService) {

  }
  ngOnInit(): void {
    this.getAllOrders();
    this.obtenerCedulaMesero();
  }
  obtenerCedulaMesero(): void {
    const userSession = this.storageService.getUserSession();
    if (userSession) {
      this.cedulaMesero = userSession.cedula; 
    }
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

  tieneOrdenes(): boolean {
    return Object.values(this.ordenesPorEstado).some(lista => lista.length > 0);
  }
  //Method to get all dishes
  getAllDishes(): void {
    this.platoService.getAllDishs().subscribe({
      next: (response: MessageDTO<platoReadDto[]>) => {
        if (!response.error) {
          this.dishes = response.respuesta;
          this.dishesActivos=response.respuesta.filter(platoReadDto => !platoReadDto.activo);
        } else {
          console.error('Error obteniendo platos:', response);
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
      },
    });
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



  //Abre el dialogo para crear una nueva orden-
  abrirModal() {
    this.mostrarModal = true;
    this.getAllDishes();
    this.platillosSeleccionados = [];
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
  //Agrega los campos para seleccionar un platillo, al igual que la cantidad.
  agregarPlatillo() {
    this.platillosSeleccionados.push({ plato: null as any, cantidad: 1 });
  }
  //Elimina el platillo de la orden
  eliminarPlatillo(index: number) {
    this.platillosSeleccionados.splice(index, 1);
  }


  //Función que crea la orden
  confirmarOrden() {
  this.errores = [];
  this.errorMesa = '';

  if (!this.mesaSeleccionada) {
    this.errorMesa = 'Debe seleccionar una mesa.';
    return;
  } 

  if (this.platillosSeleccionados.length === 0) {
    alert("Debe agregar al menos un platillo.");
    return;
  }

  const detalles: PlatilloCantidadDTO[] = [];

  for (let i = 0; i < this.platillosSeleccionados.length; i++) {
    const platillo = this.platillosSeleccionados[i];
    if (!platillo.plato || !platillo.plato.id || !platillo.cantidad || platillo.cantidad <= 0) {
      this.errores[i] = 'Debe seleccionar un platillo y una cantidad válida';
      return;
    } else {
      this.errores[i] = '';
    }

    detalles.push({
      idPlato: platillo.plato.id,
      cantidad: platillo.cantidad,
    });
  }

  const nuevaOrden: OrdenCreateDto = {
    idMesa: Number(this.mesaSeleccionada),
    cedulaMesero: this.cedulaMesero,
    platillos: detalles,
  };

  console.log('Orden a enviar:', nuevaOrden);

  this.orderService.createOrder(nuevaOrden).subscribe({
    next: (response) => {
      if (!response.error) {
        alert('✅ Orden creada con éxito');
        this.cerrarModal();
        this.getAllOrders(); // Refrescar lista
      } else {
        alert('❌ Error al crear la orden: ' + response.mensaje);
      }
    },
    error: (err) => {
      console.error('Error al crear orden:', err);
      alert('❌ Error en la comunicación con el servidor');
    }
  });
}


//-------------CANCELAR UNA ORDEN-----
  cancelarOrdenDesdePadre(id: number) {
    // Se maneja el cambio de estado en base al id recibido desde el componente hijo
    console.log('Se canceló la orden con ID:', id);
    this.ordenSeleccionada = null; // Cerrar el modal si quieres
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

//-----------DETAIL ORDER-------------
  abrirDetalleOrden(orden: any) {
    this.ordenSeleccionada = orden;
  }

//-----------PAGINACIÓN DE LAS ORDENES-----------

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
