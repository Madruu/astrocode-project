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
  readonly upcomingBookings$ = this.bookingService.getUpcomingBookings$();
  readonly pendingPayments$ = this.upcomingBookings$.pipe(
    map((bookings) => ({
      count: bookings.length,
      amount: bookings.reduce((total, booking) => total + booking.amount, 0),
    }))
  );
  readonly dashboardStats$ = combineLatest([this.summary$, this.servicesCount$, this.pendingPayments$]).pipe(
    map(([summary, servicesCount, pending]) => {
      const confirmedRevenue = summary.totalRevenue - pending.amount;
      const averageRevenue = servicesCount > 0 ? confirmedRevenue / servicesCount : 0;
      const paymentRate = summary.totalRevenue > 0 ? Math.round((confirmedRevenue / summary.totalRevenue) * 100) : 0;

      return {
        totalBookings: summary.totalBookings,
        activeServices: servicesCount,
        totalRevenue: confirmedRevenue,
        pendingRevenue: pending.amount,
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
