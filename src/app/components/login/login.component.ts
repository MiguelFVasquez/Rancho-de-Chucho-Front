import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { showAlert } from '../../dto/alert';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    // 💡 Configuración del formulario con validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  //  Getters para facilitar el acceso a los campos del formulario
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Manejo del envío del formulario con validación y redirección
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (email === 'admin@gmail.com' && password === 'admin1234') {
        //  Redirigir al componente 'administrator' si las credenciales son correctas
        this.router.navigate(['/administrator']);
      } else if(email === 'mesero@gmail.com' && password === 'mesero1234'){
          //Redirigir al componente 'Mesero' 
          this.router.navigate(['/mesero']);
      }else {
        //  Mensaje de error si las credenciales son incorrectas
        showAlert('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } else {
      //  Mensaje de error si faltan campos por completar
      showAlert(' Por favor, completa todos los campos correctamente.');
    }
  }

  // Método para limpiar el mensaje de error al modificar los campos
  clearError() {
    this.errorMessage = '';
  }
}
