import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  loading = false;
  error = '';

  form = new FormBuilder().group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AdminAuthService,
    private router: Router
  ) {}

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
      this.http.post<any>(
        'https://ntgwebsitebackend.onrender.com/api/admin/login',
        this.form.value
      )
      .subscribe({
        next: (res) => {
          this.auth.setToken(res.token);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.error = 'Invalid username or password.';
          this.loading = false;
        }
      });

  }
}
