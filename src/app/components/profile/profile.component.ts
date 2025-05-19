import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioReadDto } from '../../dto/login/UsuarioReadDto'; 
import { StorageService } from '../../services/storage.service';

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

  constructor(private router: Router,private storageService:StorageService) {}

  ngOnInit(): void {
    this.user = this.storageService.getUserSession();
    if (!this.user) {
      this.router.navigate(['/administrator']);
  }
    

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout() {
  this.storageService.clearUserSession();
  this.router.navigate(['/']);
  }
}
