import { Injectable } from '@angular/core';
import { UsuarioReadDto } from '../dto/login/UsuarioReadDto';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
 private readonly USER_SESSION_KEY = 'userSession';

  constructor() {}

  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  saveUserSession(user: UsuarioReadDto): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(user));
    }
  }

  getUserSession(): UsuarioReadDto | null {
    if (this.isBrowser()) {
      const data = localStorage.getItem(this.USER_SESSION_KEY);
      return data ? JSON.parse(data) as UsuarioReadDto : null;
    }
    return null;
  }

  clearUserSession(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.USER_SESSION_KEY);
    }
  }

  isLoggedIn(): boolean {
    return this.getUserSession() !== null;
  }
  
}
