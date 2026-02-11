import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  sending = false;
  success = false;
  errorMsg = '';

  form;   // declare first

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // ✅ initialize inside constructor
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  center: google.maps.LatLngLiteral = {
    lat: 36.02773794229768,
    lng: 14.287999952044952
  };

  zoom = 12;

  marker = {
    position: { lat: 36.02773794229768, lng: 14.287999952044952 }
  };

  submit() {
    if (this.form.invalid) return;

    this.sending = true;

    this.http.post('/api/contact', this.form.value).subscribe({
      next: () => {
        this.success = true;
        this.form.reset();
        this.sending = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to send message.';
        this.sending = false;
      }
    });
  }
}

