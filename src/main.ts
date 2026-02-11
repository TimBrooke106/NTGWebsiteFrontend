/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminTokenInterceptor } from './app/core/interceptors/admin-token.interceptor';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),

    provideAnimationsAsync(),

    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AdminTokenInterceptor, multi: true },
  ],
});


console.log(
  "%cWebsite developed by Timothy Brooke",
  "color: #dc3545; font-size: 16px; font-weight: bold;"
);
