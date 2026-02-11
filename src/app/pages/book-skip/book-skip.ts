import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepicker, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../core/services/booking.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-book-skip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepicker],
  templateUrl: './book-skip.html',
  styleUrl: './book-skip.css'
})
export class BookSkip {

  minDate!: NgbDateStruct;
  form!: ReturnType<FormBuilder['group']>;

  // ✅ NEW: base slots per day type (weekday/sat)
  private weekdaySlots = this.generateSlots('07:00', '16:00', 30);
  private saturdaySlots = this.generateSlots('08:00', '12:00', 30);

  // ✅ Replace your old 08:00-12:00 list
  timeSlots: string[] = [];
  availableSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    private booking: BookingService,
    private router: Router,
    private calendar: NgbCalendar
  ) {
    this.minDate = this.calendar.getToday();

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      preferredDate: [null as NgbDateStruct | null, Validators.required],
      timeSlot: ['', Validators.required],
      notes: ['']
    });

    // refresh available slots when date changes
    this.form.get('preferredDate')!.valueChanges.subscribe(d => {
      this.form.get('timeSlot')!.setValue('');
      if (!d) {
        this.timeSlots = [];
        this.availableSlots = [];
        return;
      }

      // ✅ NEW: set correct slots for that day BEFORE filtering booked slots
      this.timeSlots = this.getSlotsForDate(d);
      this.availableSlots = [...this.timeSlots];

      // then remove booked ones from API
      this.loadBookedSlots(d);
    });
  }

  // ✅ NEW: generate time slots helper
  private generateSlots(start: string, end: string, stepMins: number): string[] {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const slots: string[] = [];
    for (let mins = toMinutes(start); mins <= toMinutes(end); mins += stepMins) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
    return slots;
  }

  // ✅ NEW: weekday vs saturday slot selection
  private getSlotsForDate(date: NgbDateStruct): string[] {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const day = jsDate.getDay(); // 0 Sun, 6 Sat

    if (day === 6) return [...this.saturdaySlots]; // Saturday
    return [...this.weekdaySlots]; // Mon-Fri (Sundays already disabled)
  }

  isDisabled = (date: NgbDateStruct) => {
    const today = this.calendar.getToday();

    // Block past dates
    if (date.year < today.year) return true;
    if (date.year === today.year && date.month < today.month) return true;
    if (date.year === today.year && date.month === today.month && date.day < today.day) return true;

    // Block Sundays
    const jsDate = new Date(date.year, date.month - 1, date.day);
    if (jsDate.getDay() === 0) return true;

    // Block same-day after 12pm
    const isToday =
      date.year === today.year &&
      date.month === today.month &&
      date.day === today.day;

    if (isToday && this.isAfterNoonCutoff()) return true;

    return false;
  };

  private isAfterNoonCutoff(): boolean {
    const now = new Date();
    const cutoffHour = 12; // 12:00
    return now.getHours() >= cutoffHour;
  }

  private toISODateOnly(d: NgbDateStruct): string {
    const mm = String(d.month).padStart(2, '0');
    const dd = String(d.day).padStart(2, '0');
    return `${d.year}-${mm}-${dd}`; // YYYY-MM-DD
  }

  loadBookedSlots(d: NgbDateStruct) {
    const date = this.toISODateOnly(d);

    // ✅ NEW: if same-day after noon, show nothing (extra safety)
    const today = this.calendar.getToday();
    const isTodaySelected =
      d.year === today.year && d.month === today.month && d.day === today.day;

    if (isTodaySelected && this.isAfterNoonCutoff()) {
      this.availableSlots = [];
      return;
    }

    this.booking.getBookedSlots(date).subscribe({
      next: (booked: string[]) => {
        // filter from the day-specific list
        this.availableSlots = this.timeSlots.filter(s => !booked.includes(s));
      },
      error: () => {
        // if API fails, still allow selection
        this.availableSlots = [...this.timeSlots];
      }
    });
  }

  ngOnInit() {
    const today = this.calendar.getToday();
    const selected = this.form.get('preferredDate')?.value;

    const isTodaySelected =
      selected &&
      selected.year === today.year &&
      selected.month === today.month &&
      selected.day === today.day;

    if (isTodaySelected && this.isAfterNoonCutoff()) {
      this.form.get('preferredDate')?.setValue(null);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v: any = this.form.value;
    const d: NgbDateStruct = v.preferredDate;

    const payload = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      mobile: v.mobile,
      address: v.address,
      preferredDate: this.toISODateOnly(d),
      timeSlot: v.timeSlot,
      notes: v.notes
    };

    this.booking.submit(payload).subscribe({
      next: () => {
        const modalEl = document.getElementById('bookingSuccessModal');
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Failed to submit booking. Please try again.');
      }
    });
  }

  isInvalid(name: string) {
    const c = this.form.get(name);
    return !!(c && c.touched && c.invalid);
  }

  goHome() {
    const modalEl = document.getElementById('bookingSuccessModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }

    this.router.navigate(['/']);
  }
}
