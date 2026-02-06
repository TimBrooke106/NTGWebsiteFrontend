import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private api = 'https://ntgwebsitebackend.onrender.com/api/bookings';

  constructor(private http: HttpClient) {}

  getBookedSlots(date: string) {
    return this.http.get<string[]>(`${this.api}/slots?date=${encodeURIComponent(date)}`);
  }

  submit(payload: any): Observable<any> {
    return this.http.post(this.api, payload);
  }
}
