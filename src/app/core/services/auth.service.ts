import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private authToken: string | null = localStorage.getItem('auth_token');
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());

  authState$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {}

  private getUserFromStorage(): any {
    const raw = localStorage.getItem('user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

getToken(): string | null {
  return localStorage.getItem('auth_token');
}


  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(
      `${this.apiUrl}/api/auth/login`,
      { email, password }
    ).pipe(
      tap({
        next: (response) => {
          this.setToken(response.token);
          this.setCurrentUser(response.user);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.logout();
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

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  const user = this.getUserFromStorage();
  return !!token && !!user;
}


  updateCurrentUser(updatedUser: any): void {
  localStorage.setItem('user', JSON.stringify(updatedUser));
  this.currentUserSubject.next(updatedUser);
}

}
