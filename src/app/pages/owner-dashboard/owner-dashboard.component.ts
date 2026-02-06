import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


type Booking = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  skipSize: string;
  materialType: string;
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
    bookings: Booking[] = [];
    stats = { totalBookings: 0, pending: 0, confirmed: 0 };
    loading = true;

    constructor(
    private http: HttpClient,
    private auth: AdminAuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
    ) {}

    updatingId: number | null = null;

    updateStatus(id: number, status: 'Confirmed' | 'Rejected') {
        if (status === 'Rejected' && !confirm('Reject this booking?')) return;
        this.updatingId = id;

        this.http.put(`/api/bookings/admin/${id}/status`, { status }).subscribe({
            next: () => {
            // Update UI locally
            const b = this.bookings.find(x => x.id === id);
            if (b) b.status = status;

            // Refresh stats (and optional refresh list)
            this.http.get<any>('/api/bookings/admin/stats').subscribe(s => {
                this.stats = {
                totalBookings: s.totalBookings ?? 0,
                pending: s.pending ?? 0,
                confirmed: s.confirmed ?? 0
                };
            });

            this.updatingId = null;
            },
            error: (err) => {
            console.error('Update status error', err);
            this.updatingId = null;
            alert('Failed to update status.');
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



    ngOnInit() {
        this.load();
    }

    load() {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any>('/api/bookings/admin/stats').subscribe({
        next: (s) => {
        this.stats = {
            totalBookings: s.totalBookings ?? 0,
            pending: s.pending ?? 0,
            confirmed: s.confirmed ?? 0
        };
        this.cdr.detectChanges(); // ✅ refresh UI
        },
        error: (err) => {
        console.error('Stats error', err);
        this.cdr.detectChanges();
        }
    });

    this.http.get<Booking[]>('/api/bookings/admin').subscribe({
        next: (data) => {
        this.bookings = data;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ refresh UI
        },
        error: (err) => {
        console.error('Bookings error', err);
        this.loading = false;
        this.cdr.detectChanges();
        }
    });
    }


    logout() {
        this.http.post('/api/admin/logout', {}).subscribe({ complete: () => this.auth.logout() });
    }
}
