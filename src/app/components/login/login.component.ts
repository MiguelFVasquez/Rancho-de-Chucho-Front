import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginDto } from '../../dto/login/LoginDto';
import { AuthService } from '../../services/auth.service';
import { showAlert } from '../../dto/alert';
import { StorageService } from '../../services/storage.service';
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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private storageService:StorageService) {
    // 💡 Configuración del formulario con validaciones
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // username sin validator
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  //  Getters para facilitar el acceso a los campos del formulario
  get username() {
    return this.loginForm.get('username');
  }
  
  get password() {
    return this.loginForm.get('password');
  }

  // Manejo del envío del formulario con validación y redirección
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      // ADMIN HARDCODEADO
      if (username === 'admin@gmail.com' && password === 'admin1234') {
        this.router.navigate(['/administrator/inventory']);
        return;
      }
      //Staff hardcodeado
      else if (username === 'staff@gmail.com' && password === 'staff1234') {
        this.router.navigate(['/staff/order']);
        return;
      }
      else if(username === 'mesero@gmail.com' && password === 'mesero1234'){
        this.router.navigate(['/mesero/order']);
      }
      
      const dto: LoginDto = {
        username: username,
        password: password
      };
  
      this.authService.loginMesero(dto).subscribe({
        next: (response) => {
          if (!response.error) {
            //Se guarda la información en local storage
            this.storageService.saveUserSession(response.respuesta);           
            //  Redirigir al componente del mesero si se valida correctamente
            this.router.navigate(['/mesero']);
            
          }
        },
        error: (err) => {
          console.error('Error de login:', err);
          showAlert('Error al iniciar sesión. Inténtalo más tarde.','error');
        }
      });
  
    } else {
      showAlert('Por favor, completa todos los campos correctamente.', "error");
    }
  }
  
  // Método para limpiar el mensaje de error al modificar los campos
  clearError() {
    this.errorMessage = '';
  }
}
