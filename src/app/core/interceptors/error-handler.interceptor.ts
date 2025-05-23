import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 401: // Unauthorized
         // inject(AuthService).logout(); // Cleaner dependency injection
      //   router.navigate(['/forbidden']);
          break;
        case 403: // Forbidden
        //  router.navigate(['/forbidden']);
          break;
        case 404: // Not Found
        //  router.navigate(['/not-found']);
          break;
      }
      throw error;
    })
  );
};