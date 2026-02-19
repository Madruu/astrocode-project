import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private blockedSlots: string[] = [
    this.toSlotIso(new Date(Date.now() + 24 * 60 * 60 * 1000), 11),
    this.toSlotIso(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 15),
    this.toSlotIso(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), 10),
  ];

  getBlockedSlots$(): Observable<string[]> {
    return of(this.blockedSlots);
  }

  isSlotBlocked$(slotIso: string): Observable<boolean> {
    return this.getBlockedSlots$().pipe(map((slots) => slots.includes(slotIso)));
  }

  getAvailableSlots$(date: Date, bookedSlots: string[]): Observable<string[]> {
    return of(date).pipe(
      map((targetDate) => {
        const base = new Date(targetDate);
        base.setHours(0, 0, 0, 0);

        const slots: string[] = [];
        for (let hour = 8; hour <= 18; hour += 1) {
          const slot = new Date(base);
          slot.setHours(hour, 0, 0, 0);
          slots.push(slot.toISOString());
        }

        return slots;
      }),
      map((slots) =>
        slots.filter((slot) => {
          const slotDate = new Date(slot);
          return slotDate.getTime() > Date.now() && !bookedSlots.includes(slot) && !this.blockedSlots.includes(slot);
        })
      ),
      catchError(() => of([]))
    );
  }

  private toSlotIso(day: Date, hour: number): string {
    const copy = new Date(day);
    copy.setHours(hour, 0, 0, 0);
    return copy.toISOString();
  }
}
