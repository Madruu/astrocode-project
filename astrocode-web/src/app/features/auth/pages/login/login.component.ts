import { Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  readonly mockCredentials = this.authService.getMockCredentials();
  readonly mockProviderCredentials = this.authService.getMockProviderCredentials();
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: [this.mockCredentials.email, [Validators.required, Validators.email]],
    password: [this.mockCredentials.password, [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login(this.loginForm.getRawValue() as any)
      .pipe(finalize(() => this.loading.set(false)), takeUntil(this.destroy$))
      .subscribe({
        next: (user) =>
          this.router.navigate([user.accountType === 'PROVIDER' ? '/provider-dashboard' : '/dashboard']),
        error: () => this.errorMessage.set('Email ou senha inválidos'),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
