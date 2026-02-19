import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, map, of, switchMap, take, throwError } from 'rxjs';

import { PaymentService } from './payment.service';
import { ScheduleService } from './schedule.service';

export interface ServiceOption {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  clientName: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  startAt: string;
  amount: number;
  status: BookingStatus;
  cancelledAt?: string;
  paymentTransactionId?: string;
}

export interface DashboardSummary {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

export interface CreateBookingInput {
  clientName: string;
  userId: string;
  serviceId: string;
  startAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private paymentService = inject(PaymentService);
  private scheduleService = inject(ScheduleService);
  private cancellationLimitByMonth = 2;

  private serviceOptions: ServiceOption[] = [
    { id: 'srv-001', name: 'Corte Masculino', durationMinutes: 45, price: 80 },
    { id: 'srv-002', name: 'Design de Sobrancelhas', durationMinutes: 30, price: 55 },
    { id: 'srv-003', name: 'Manicure Premium', durationMinutes: 60, price: 120 },
    { id: 'srv-004', name: 'Massagem Relaxante', durationMinutes: 90, price: 220 },
  ];

  private bookingsSubject = new BehaviorSubject<Booking[]>([
    {
      id: 'bk-1001',
      clientName: 'Carla Mendes',
      userId: 'user-001',
      serviceId: 'srv-001',
      serviceName: 'Corte Masculino',
      startAt: this.createRelativeIso(1, 10),
      amount: 80,
      status: 'confirmed',
      paymentTransactionId: 'txn_1001',
    },
    {
      id: 'bk-1002',
      clientName: 'Marcos Silva',
      userId: 'user-001',
      serviceId: 'srv-004',
      serviceName: 'Massagem Relaxante',
      startAt: this.createRelativeIso(2, 16),
      amount: 220,
      status: 'confirmed',
      paymentTransactionId: 'txn_1002',
    },
    {
      id: 'bk-1003',
      clientName: 'Julia Costa',
      userId: 'user-001',
      serviceId: 'srv-002',
      serviceName: 'Design de Sobrancelhas',
      startAt: this.createRelativeIso(-2, 11),
      amount: 55,
      status: 'cancelled',
      cancelledAt: this.createRelativeIso(-4, 14),
      paymentTransactionId: 'txn_0995',
    },
  ]);

  getServiceOptions$(): Observable<ServiceOption[]> {
    return of(this.serviceOptions);
  }

  getBookings$(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable().pipe(
      map((bookings) =>
        [...bookings].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
      )
    );
  }

  getUpcomingBookings$(): Observable<Booking[]> {
    return this.getBookings$().pipe(
      map((bookings) => bookings.filter((booking) => booking.status === 'confirmed')),
      map((bookings) => bookings.filter((booking) => new Date(booking.startAt).getTime() >= Date.now())),
      map((bookings) => bookings.slice(0, 8))
    );
  }

  getSummary$(): Observable<DashboardSummary> {
    return this.getBookings$().pipe(
      map((bookings) => ({
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((booking) => booking.status === 'confirmed').length,
        cancelledBookings: bookings.filter((booking) => booking.status === 'cancelled').length,
        totalRevenue: bookings
          .filter((booking) => booking.status === 'confirmed')
          .reduce((acc, booking) => acc + booking.amount, 0),
      }))
    );
  }

  createBooking$(input: CreateBookingInput): Observable<Booking> {
    return this.getServiceOptions$().pipe(
      map((services) => services.find((service) => service.id === input.serviceId)),
      filter((service): service is ServiceOption => !!service),
      switchMap((service) => {
        const bookingDate = new Date(input.startAt);
        if (bookingDate.getTime() < Date.now()) {
          return throwError(() => new Error('Nao e permitido agendar em data passada.'));
        }

        return this.scheduleService.isSlotBlocked$(input.startAt).pipe(
          switchMap((isBlocked) => {
            if (isBlocked) {
              return throwError(() => new Error('Este horario esta bloqueado para agendamentos.'));
            }

            return this.paymentService.processPayment(service.price).pipe(
              map((transaction) => ({
                id: `bk-${Date.now()}`,
                clientName: input.clientName,
                userId: input.userId,
                serviceId: service.id,
                serviceName: service.name,
                startAt: input.startAt,
                amount: service.price,
                status: 'confirmed' as const,
                paymentTransactionId: transaction.transactionId,
              }))
            );
          })
        );
      }),
      switchMap((booking) =>
        this.getBookings$().pipe(
          take(1),
          map((bookings) => {
            const sameSlotBooking = bookings.find(
              (current) => current.startAt === booking.startAt && current.status === 'confirmed'
            );
            if (sameSlotBooking) {
              throw new Error('Horario indisponivel. Selecione outro intervalo.');
            }
            return [...bookings, booking];
          }),
          map((updatedBookings) => {
            this.bookingsSubject.next(updatedBookings);
            return booking;
          })
        )
      ),
      catchError((error: unknown) =>
        throwError(() =>
          new Error(error instanceof Error ? error.message : 'Nao foi possivel concluir o agendamento.')
        )
      )
    );
  }

  cancelBooking$(bookingId: string, userId: string): Observable<void> {
    return this.getBookings$().pipe(
      take(1),
      map((bookings) => {
        const target = bookings.find((booking) => booking.id === bookingId);
        if (!target) {
          throw new Error('Agendamento nao encontrado.');
        }

        if (target.status === 'cancelled') {
          throw new Error('Este agendamento ja foi cancelado.');
        }

        if (new Date(target.startAt).getTime() <= Date.now()) {
          throw new Error('Nao e permitido cancelar agendamentos passados.');
        }

        const monthCancellationCount = bookings.filter((booking) => {
          if (booking.status !== 'cancelled' || booking.userId !== userId || !booking.cancelledAt) {
            return false;
          }

          const cancellationDate = new Date(booking.cancelledAt);
          const now = new Date();
          return (
            cancellationDate.getMonth() === now.getMonth() &&
            cancellationDate.getFullYear() === now.getFullYear()
          );
        }).length;

        if (monthCancellationCount >= this.cancellationLimitByMonth) {
          throw new Error('Limite de cancelamentos do mes atingido.');
        }

        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const, cancelledAt: new Date().toISOString() }
            : booking
        );
        this.bookingsSubject.next(updatedBookings);
      }),
      catchError((error: unknown) =>
        throwError(() =>
          new Error(error instanceof Error ? error.message : 'Erro ao cancelar agendamento.')
        )
      )
    );
  }

  private createRelativeIso(dayOffset: number, hour: number): string {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  }
}
