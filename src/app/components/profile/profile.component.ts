import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  successMessage: string = '';

  constructor(private fb: FormBuilder) {
    // 🎯 Inicialización del formulario reactivo con validaciones
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get name() {
    return this.profileForm.get('name');
  }
  
  get id() {
    return this.profileForm.get('cedula');
  }

  get username() {
    return this.profileForm.get('username');
  }

  get password() {
    return this.profileForm.get('password');
  }

  // 🚀 Maneja el envío del formulario y muestra mensaje si es exitoso
  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Perfil actualizado:', this.profileForm.value);
      this.successMessage = '✅ Perfil actualizado exitosamente';
    } else {
      this.successMessage = '⚠️ Revisa los campos del formulario';
    }
  }

  // 🧹 Limpia el mensaje de éxito al modificar los campos
  clearMessage() {
    this.successMessage = '';
  }
}

