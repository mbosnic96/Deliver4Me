import { Injectable, signal, effect, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authToken = signal<string | null>(
    localStorage.getItem('auth_token') // Initialize from storage
  );

  // Dependencies
  private router = inject(Router);
  private http = inject(HttpClient);

  // Auto-save to localStorage when token changes
  private tokenEffect = effect(() => {
    const token = this.authToken();
    token 
      ? localStorage.setItem('auth_token', token)
      : localStorage.removeItem('auth_token');
  });

  setToken(token: string): void {
    this.authToken.set(token);
  }

  getToken(): string | null {
    return this.authToken();
  }

 // auth.service.ts
login(email: string, password: string) {
  return this.http.post<{ token: string }>('api/auth/login', { email, password }).pipe(
    tap({
      next: (response) => {
        this.authToken.set(response.token); // Now TypeScript knows response has token
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Login failed:', err)
    })
  );
}
  
  logout(): void {
    this.authToken.set(null);
    this.router.navigate(['/login']);
  }

  // Optional: Add computed property for auth state
  isAuthenticated = computed(() => !!this.authToken());
}