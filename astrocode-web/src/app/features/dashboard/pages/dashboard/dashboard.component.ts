import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, Subject, catchError, combineLatest, filter, map, of, switchMap, take, takeUntil } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { Booking, BookingService } from '../../../../core/services/booking.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { BookingDetailsDialogComponent } from '../../components/booking-detail-dialog/booking-details-dialog.component';
import { NewBookingDialogComponent } from '../../components/new-booking-dialog/new-booking-dialog.component';

type CalendarMode = 'month' | 'week';

interface CalendarDayVm {
  date: Date;
  inCurrentMonth: boolean;
  bookings: Booking[];
  blockedSlots: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatDialogModule,
    DatePipe,
    CurrencyPipe,
    RouterLink,
  ],
})
export class DashboardComponent implements OnDestroy {
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private scheduleService = inject(ScheduleService);
  private loadingService = inject(LoadingService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  private destroy$ = new Subject<void>();
  private focusDateSubject = new BehaviorSubject<Date>(new Date());
  private modeSubject = new BehaviorSubject<CalendarMode>('month');

  readonly loading$ = this.loadingService.isLoading$;
  readonly user$ = this.authService.currentUser$;
  readonly summary$ = this.bookingService.getSummary$();
  readonly bookings$ = this.bookingService.getBookings$();
  readonly upcomingBookings$ = this.bookingService.getUpcomingBookings$();
  readonly blockedSlots$ = this.scheduleService.getBlockedSlots$();
  readonly mode$ = this.modeSubject.asObservable();
  readonly focusDate$ = this.focusDateSubject.asObservable();

  readonly calendarDays$ = combineLatest([
    this.bookings$,
    this.blockedSlots$,
    this.focusDate$,
    this.mode$,
  ]).pipe(map(([bookings, blockedSlots, date, mode]) => this.createCalendarDays(bookings, blockedSlots, date, mode)));

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setMode(mode: CalendarMode): void {
    this.modeSubject.next(mode);
  }

  nextRange(): void {
    const current = new Date(this.focusDateSubject.value);
    if (this.modeSubject.value === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else {
      current.setDate(current.getDate() + 7);
    }
    this.focusDateSubject.next(current);
  }

  previousRange(): void {
    const current = new Date(this.focusDateSubject.value);
    if (this.modeSubject.value === 'month') {
      current.setMonth(current.getMonth() - 1);
    } else {
      current.setDate(current.getDate() - 7);
    }
    this.focusDateSubject.next(current);
  }

  openDayDetails(day: CalendarDayVm): void {
    this.dialog.open(BookingDetailsDialogComponent, {
      width: '640px',
      data: {
        day: day.date,
        bookings: day.bookings,
        blockedSlots: day.blockedSlots,
      },
    });
  }

  openNewBooking(): void {
    combineLatest([this.user$, this.bookings$])
      .pipe(
        take(1),
        filter((result): result is [NonNullable<(typeof result)[0]>, Booking[]] => !!result[0]),
        takeUntil(this.destroy$)
      )
      .subscribe(([user, bookings]) => {
        const dialogRef = this.dialog.open(NewBookingDialogComponent, {
          width: '760px',
          data: {
            userId: user.id,
            bookings,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(filter((result) => !!result), takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.open('Agenda atualizada com sucesso.', 'Fechar', { duration: 2500 });
          });
      });
  }

  cancelBooking(bookingId: string): void {
    this.user$
      .pipe(
        take(1),
        filter((user): user is NonNullable<typeof user> => !!user),
        switchMap((user) => this.bookingService.cancelBooking$(bookingId, user.id)),
        catchError((error: unknown) => {
          const message = error instanceof Error ? error.message : 'Falha ao cancelar o agendamento.';
          this.snackBar.open(message, 'Fechar', { duration: 3500 });
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.snackBar.open('Agendamento cancelado.', 'Fechar', { duration: 2500 });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createCalendarDays(
    bookings: Booking[],
    blockedSlots: string[],
    focusDate: Date,
    mode: CalendarMode
  ): CalendarDayVm[] {
    if (mode === 'week') {
      return this.createWeekDays(bookings, blockedSlots, focusDate);
    }
    return this.createMonthDays(bookings, blockedSlots, focusDate);
  }

  private createMonthDays(bookings: Booking[], blockedSlots: string[], focusDate: Date): CalendarDayVm[] {
    const firstDay = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return this.mapDay(date, focusDate, bookings, blockedSlots);
    });
  }

  private createWeekDays(bookings: Booking[], blockedSlots: string[], focusDate: Date): CalendarDayVm[] {
    const start = new Date(focusDate);
    start.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return this.mapDay(date, focusDate, bookings, blockedSlots);
    });
  }

  private mapDay(date: Date, focusDate: Date, bookings: Booking[], blockedSlots: string[]): CalendarDayVm {
    const dayBookings = bookings.filter((booking) => this.isSameDay(new Date(booking.startAt), date));
    const dayBlockedSlots = blockedSlots.filter((slot) => this.isSameDay(new Date(slot), date));

    return {
      date,
      inCurrentMonth: date.getMonth() === focusDate.getMonth(),
      bookings: dayBookings,
      blockedSlots: dayBlockedSlots,
    };
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }
}
