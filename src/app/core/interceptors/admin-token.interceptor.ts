import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable()
export class AdminTokenInterceptor implements HttpInterceptor {
  constructor(private auth: AdminAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();
    if (!token) return next.handle(req);

    // Only attach to admin endpoints (optional but good practice)
    const isAdminCall = req.url.includes('/api/bookings/admin') || req.url.includes('/api/admin');
    if (!isAdminCall) return next.handle(req);

    return next.handle(
      req.clone({
        setHeaders: { 'X-Admin-Token': token }
      })
    );
  }
}
