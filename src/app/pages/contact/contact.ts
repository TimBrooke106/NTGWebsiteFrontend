import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  center: google.maps.LatLngLiteral = { lat: 36.02773794229768, lng: 14.287999952044952 };
  zoom = 12;

  marker = {
    position: { lat: 36.02773794229768, lng: 14.287999952044952 }
  };

  submit() {
    if (this.form.invalid) return;
    console.log(this.form.value);
  }
}
