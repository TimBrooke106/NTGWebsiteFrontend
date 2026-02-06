/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminTokenInterceptor } from './app/core/interceptors/admin-token.interceptor';

bootstrapApplication(App, {
  providers: [
      provideHttpClient(withInterceptorsFromDi()),
  { provide: HTTP_INTERCEPTORS, useClass: AdminTokenInterceptor, multi: true },
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient()
    
  ]
});