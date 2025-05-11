import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    const expectedRole = route.data['role'];

    // Use authState$ to check authentication and user role
    return this.authService.authState$.pipe(
      map(isAuthenticated => {
        const currentUser = this.authService.getCurrentUser();
        if (isAuthenticated && currentUser?.role === expectedRole) {
          return true;
        }
        return this.router.createUrlTree(['/unauthorized']);
      })
    );
  }
}
