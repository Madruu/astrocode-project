import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map, of, startWith, switchMap } from 'rxjs';

import { Booking, BookingService, ServiceOption } from '../../../../core/services/booking.service';
import { ScheduleService } from '../../../../core/services/schedule.service';

interface NewBookingDialogData {
  userId: string;
  bookings: Booking[];
}

interface SlotOption {
  iso: string;
  label: string;
}

@Component({
  selector: 'app-new-booking-dialog',
  standalone: true,
  templateUrl: './new-booking-dialog.component.html',
  styleUrl: './new-booking-dialog.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  providers: [DatePipe, CurrencyPipe],
})
export class NewBookingDialogComponent {
  private destroyRef = inject(DestroyRef);
  private bookingService = inject(BookingService);
  private scheduleService = inject(ScheduleService);
  private snackBar = inject(MatSnackBar);

  readonly form = inject(FormBuilder).nonNullable.group({
    clientName: ['', [Validators.required, Validators.minLength(3)]],
    serviceId: ['', Validators.required],
    date: ['', Validators.required],
    slot: ['', Validators.required],
  });

  readonly serviceOptions$ = this.bookingService.getServiceOptions$();
  readonly availableSlots$ = this.form.controls.date.valueChanges.pipe(
    startWith(this.form.controls.date.value),
    map((dateValue) => this.parseInputDate(dateValue)),
    switchMap((date) => {
      if (!date) {
        return of([] as SlotOption[]);
      }

      const bookedSlots = this.data.bookings
        .filter((booking) => booking.status === 'confirmed')
        .filter((booking) => this.isSameDay(new Date(booking.startAt), date))
        .map((booking) => booking.startAt);

      return this.scheduleService.getAvailableSlots$(date, bookedSlots).pipe(
        map((slots) =>
          slots.map((slotIso) => ({
            iso: slotIso,
            label: this.datePipe.transform(slotIso, 'HH:mm') ?? '',
          }))
        )
      );
    })
  );

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: NewBookingDialogData,
    private dialogRef: MatDialogRef<NewBookingDialogComponent>,
    private datePipe: DatePipe
  ) {
    this.form.controls.date.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.controls.slot.reset('');
    });
  }

  displayServiceLabel(service: ServiceOption): string {
    const duration = `${service.durationMinutes} min`;
    const price = this.currencyPipe.transform(service.price, 'BRL', 'symbol', '1.2-2') ?? 'R$ 0,00';
    return `${service.name} - ${duration} - ${price}`;
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.loading = true;

    this.bookingService
      .createBooking$({
        clientName: raw.clientName.trim(),
        userId: this.data.userId,
        serviceId: raw.serviceId,
        startAt: raw.slot,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error: unknown) => {
          this.loading = false;
          const message = error instanceof Error ? error.message : 'Nao foi possivel concluir o agendamento.';
          this.snackBar.open(message, 'Fechar', { duration: 3500 });
        },
      });
  }

  private currencyPipe = inject(CurrencyPipe);

  private parseInputDate(value: string): Date | null {
    if (!value) {
      return null;
    }

    const [yearRaw, monthRaw, dayRaw] = value.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    const day = Number(dayRaw);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date();
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }
}
