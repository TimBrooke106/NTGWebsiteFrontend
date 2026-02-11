import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/enviroment';

type Booking = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
};

@Component({
  standalone: true,
  selector: 'app-owner-dashboard',
  imports: [CommonModule],
  templateUrl: './owner-dashboard.component.html'
})
export class OwnerDashboardComponent implements OnInit {
  private API = environment.apiBaseUrl;

  bookings: Booking[] = [];
  stats = { totalBookings: 0, pending: 0, confirmed: 0 };
  loading = true;
  updatingId: number | null = null;

  constructor(
    private http: HttpClient,
    private auth: AdminAuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any>(`${this.API}/api/bookings/admin/stats`).subscribe({
      next: (s) => {
        this.stats = {
          totalBookings: s.totalBookings ?? 0,
          pending: s.pending ?? 0,
          confirmed: s.confirmed ?? 0
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Stats error', err);
        this.cdr.detectChanges();
      }
    });

    this.http.get<Booking[]>(`${this.API}/api/bookings/admin`).subscribe({
      next: (data) => {
        this.bookings = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Bookings error', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(id: number, status: 'Confirmed' | 'Rejected') {
    this.updatingId = id;
    this.cdr.detectChanges();

    // ✅ Rejected = call your PUT status endpoint (backend already deletes on Rejected)
    // (Cleaner than calling DELETE separately)
    this.http.put(`${this.API}/api/bookings/admin/${id}/status`, { status }).subscribe({
      next: () => {
        this.updatingId = null;

        // ✅ refresh bookings + stats in one place
        this.load();
      },
      error: (err) => {
        console.error('Update status error', err);
        this.updatingId = null;
        alert(err?.error?.message || 'Failed to update status.');
        this.cdr.detectChanges();
      }
    });
  }

  badgeClass(status: string) {
    switch (status) {
      case 'Confirmed': return 'text-bg-success';
      case 'Rejected': return 'text-bg-danger';
      default: return 'text-bg-warning';
    }
  }

  logout() {
    this.http.post(`${this.API}/api/admin/logout`, {}).subscribe({
      complete: () => this.auth.logout()
    });
    // remove this.router.navigate('/login') because auth.logout() already navigates
  }
}
