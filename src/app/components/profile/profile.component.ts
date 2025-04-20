import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioReadDto } from '../../dto/login/UsuarioReadDto'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  showPassword = false;
  user: UsuarioReadDto | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('userSession');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // Si no hay sesión, redirige al login
      this.router.navigate(['/login']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    localStorage.removeItem('userSession');
    this.router.navigate(['/login']);
  }
}
