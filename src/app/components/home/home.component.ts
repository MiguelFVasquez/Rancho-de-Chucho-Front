// Importación de módulos y componentes necesarios
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { ChangeDetectorRef, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router'; 
import { LoginComponent } from '../login/login.component'; 

// Decorador @Component que define el componente HomeComponent
@Component({
  selector: 'app-home', 
  standalone: true, 
  imports: [CommonModule, RouterModule, LoginComponent], // Módulos y componentes que se importan para su uso en este componente
  templateUrl: './home.component.html',
  styleUrl: './home.component.css' // Ruta al archivo de estilos CSS del componente
})
export class HomeComponent {
  // Propiedad para determinar si la página actual es la de login
  esLoginPage = false;
  // Propiedad para controlar la visibilidad del footer
  footerVisible = false;

  // Constructor del componente, inyecta las dependencias necesarias
  constructor(
              private router: Router, 
              private cdr: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: Object) {

    // Suscripción a los eventos del enrutador para detectar cambios en la navegación
    this.router.events.subscribe(event => {
      // Verifica si el evento es una instancia de NavigationEnd (cuando la navegación termina)
      if (event instanceof NavigationEnd) {
        // Actualiza la propiedad esLoginPage basándose en la URL actual
        this.esLoginPage = event.urlAfterRedirects === '/login';
      }
    });
  }

  // Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente se haya inicializado
  ngAfterViewInit() {
    // Verifica la visibilidad del footer al inicializar la vista
    this.checkFooterVisibility();
    // Fuerza la detección de cambios para asegurar que la vista se actualice
    this.cdr.detectChanges();
  }

  // Decorador @HostListener que escucha el evento de scroll en la ventana
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica la visibilidad del footer cada vez que se hace scroll
    this.checkFooterVisibility();
  }

  // Método privado para verificar si el footer debe ser visible
  private checkFooterVisibility() {
    if (isPlatformBrowser(this.platformId)) { //  Solo se ejecuta en el navegador
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.body.scrollHeight;
  
      if (scrollPosition >= documentHeight - 100 && !this.footerVisible) {
        this.footerVisible = true;
        this.cdr.detectChanges();
      }
    }
  }
}