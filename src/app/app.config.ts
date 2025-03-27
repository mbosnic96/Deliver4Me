import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withRequestsMadeViaParent } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🔥 Experimental Zoneless (recommended for new projects)
    provideExperimentalZonelessChangeDetection(),

    // 🚀 Router with modern features
    provideRouter(
      routes,
      withComponentInputBinding(), // For direct route param binding
      withViewTransitions({        // Smooth page transitions
        skipInitialTransition: true // Skip on initial load
      })
    ),

    // 🌐 HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,          // JWT token handling
        errorHandlerInterceptor   // Global error handling
      ]),
//withRequestsMadeViaParent() // Better SSR compatibility
    ),

    // 🎭 Async animations (non-blocking)
    provideAnimationsAsync()
  ]
};