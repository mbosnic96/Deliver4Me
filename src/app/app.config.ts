import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';

// Font Awesome imports
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';



export const appConfig: ApplicationConfig = {
  providers: [
    // 🔥 Experimental Zoneless
    provideExperimentalZonelessChangeDetection(),

    // 🚀 Router with modern features
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({
        skipInitialTransition: true
      })
    ),

    // 🌐 HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorHandlerInterceptor
      ])
    ),

    // 🎭 Async animations
    provideAnimationsAsync(),

    // ✨ Font Awesome configuration
    importProvidersFrom(FontAwesomeModule),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        library.addIconPacks(fas, far, fab);
        return library;
      }
    },
    
  ]
};