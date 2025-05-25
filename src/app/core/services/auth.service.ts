import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../enviroments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private authToken: string | null = localStorage.getItem('auth_token');
  private authSubject = new BehaviorSubject<boolean>(false);
  authState$ = this.authSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('auth_token');
    this.authToken = token;
    this.authSubject.next(!!token);
  }

  setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
    this.authSubject.next(true);
  }

  getToken(): string | null {
    return this.authToken;
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(
      `${this.apiUrl}/api/auth/login`,
      { email, password }
    ).pipe(
      tap({
        next: (response) => {
          this.setToken(response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.authSubject.next(false);
        }
      })
    );
  }

  register(data: any) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/api/auth/register`,
      data
    ).pipe(
      tap({
        next: (res) => console.log('User registered:', res.message),
        error: (err) => console.error('Registration failed:', err)
      })
    );
  }

  getCurrentUser(): any {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined') return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse user from localStorage:', raw);
      return null;
    }
  }

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.authSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.authToken && !!localStorage.getItem('auth_token');
  }
}
