import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { combineLatest, map } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { BookingService } from '../../../../core/services/booking.service';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    CurrencyPipe,
    RouterLink,
  ],
})
export class ProviderDashboardComponent {
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  readonly loading$ = this.loadingService.isLoading$;
  readonly user$ = this.authService.currentUser$;
  readonly summary$ = this.bookingService.getSummary$();
  readonly servicesCount$ = this.bookingService.getServiceOptions$().pipe(map((services) => services.length));

  /** Revenue stats use payment status (paymentTransactionId) to match the Pagamentos page logic. */
  readonly revenueStats$ = this.bookingService.getBookings$().pipe(
    map((bookings) => {
      const confirmed = bookings.filter((b) => b.status === 'confirmed');
      const paid = confirmed.filter((b) => b.paymentTransactionId);
      const pending = confirmed.filter((b) => !b.paymentTransactionId);
      const totalRevenue = paid.reduce((acc, b) => acc + b.amount, 0);
      const pendingRevenue = pending.reduce((acc, b) => acc + b.amount, 0);
      return { totalRevenue, pendingRevenue };
    })
  );

  readonly dashboardStats$ = combineLatest([
    this.summary$,
    this.servicesCount$,
    this.revenueStats$,
  ]).pipe(
    map(([summary, servicesCount, revenue]) => {
      const averageRevenue = servicesCount > 0 ? revenue.totalRevenue / servicesCount : 0;
      const totalWithPending = revenue.totalRevenue + revenue.pendingRevenue;
      const paymentRate =
        totalWithPending > 0 ? Math.round((revenue.totalRevenue / totalWithPending) * 100) : 0;

      return {
        totalBookings: summary.totalBookings,
        activeServices: servicesCount,
        totalRevenue: revenue.totalRevenue,
        pendingRevenue: revenue.pendingRevenue,
        averageRevenue,
        paymentRate,
      };
    })
  );

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
