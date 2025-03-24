import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {}
    // Alternar visibilidad de la contraseña
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

    // Función para cerrar sesión y redirigir al login
    logout() {
      // Elimina la sesión del usuario (ajústalo según tu lógica de autenticación)
      localStorage.removeItem('userSession'); 
  
      // Redirige a la pantalla de login
      this.router.navigate(['*']);
    }
}

