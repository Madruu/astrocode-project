import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { BookingApiService } from './booking-api.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private bookingApiService: BookingApiService) {}

  getAvailableSlots$(taskId: number, date: Date): Observable<string[]> {
    const day = this.toDateKey(date);
    return this.bookingApiService.getAvailableSlots$(taskId, day).pipe(catchError(() => of([])));
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
