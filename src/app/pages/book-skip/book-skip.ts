import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../core/services/booking.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';


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

  timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00'];
  availableSlots = [...this.timeSlots];

  constructor(private fb: FormBuilder, private booking: BookingService, private router: Router, private calendar: NgbCalendar) {
    this.minDate = this.calendar.getToday();

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      skipSize: ['', Validators.required],
      materialType: ['', Validators.required],
      preferredDate: [null as NgbDateStruct | null, Validators.required],
      timeSlot: ['', Validators.required], // ✅ NEW
      notes: ['']
    });

    // refresh available slots when date changes
    this.form.get('preferredDate')!.valueChanges.subscribe(d => {
      this.form.get('timeSlot')!.setValue('');
      if (!d) return;
      this.loadBookedSlots(d);
    });
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


  // inside BookSkip component
  private isAfterNoonCutoff(): boolean {
    const now = new Date();
    const cutoffHour = 12; // 12:00
    return now.getHours() >= cutoffHour; // 12:00+ blocks same-day
  }



  private toISODateOnly(d: NgbDateStruct): string {
    const mm = String(d.month).padStart(2, '0');
    const dd = String(d.day).padStart(2, '0');
    return `${d.year}-${mm}-${dd}`; // YYYY-MM-DD
  }

  loadBookedSlots(d: NgbDateStruct) {
    const date = this.toISODateOnly(d);
    this.booking.getBookedSlots(date).subscribe({
      next: (booked: string[]) => {
        this.availableSlots = this.timeSlots.filter(s => !booked.includes(s));
      },
      error: () => {
        // if API fails, still allow selection (or choose to block)
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
      skipSize: v.skipSize,
      materialType: v.materialType,
      preferredDate: this.toISODateOnly(d), // ✅ send date only
      timeSlot: v.timeSlot,                 // ✅ send slot
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
        alert('Failed to submit booking. Please try again.');
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
