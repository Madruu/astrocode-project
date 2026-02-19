import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';

export interface PaymentTransaction {
  transactionId: string;
  amount: number;
  status: 'approved' | 'declined';
  processedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  processPayment(amount: number): Observable<PaymentTransaction> {
    return of(amount).pipe(
      delay(600),
      map((value) => ({
        transactionId: `txn_${Date.now()}`,
        amount: value,
        status: (Math.random() < 0.9 ? 'approved' : 'declined') as 'approved' | 'declined',
        processedAt: new Date().toISOString(),
      })),
      switchMap((transaction) => {
        if (transaction.status === 'declined') {
          return throwError(() => new Error('Pagamento recusado pela operadora.'));
        }
        return of(transaction);
      }),
      catchError((error: unknown) =>
        throwError(() =>
          new Error(
            error instanceof Error ? error.message : 'Falha inesperada no processamento do pagamento.'
          )
        )
      )
    );
  }
}
