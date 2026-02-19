import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

import { Booking } from '../../../../core/services/booking.service';

interface BookingDetailsDialogData {
  day: Date;
  bookings: Booking[];
  blockedSlots: string[];
}

@Component({
  selector: 'app-booking-details-dialog',
  standalone: true,
  templateUrl: './booking-details-dialog.component.html',
  styleUrl: './booking-details-dialog.component.css',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatChipsModule, MatListModule, DatePipe, CurrencyPipe],
})
export class BookingDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: BookingDetailsDialogData) {}
}
