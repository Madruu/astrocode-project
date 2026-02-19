import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, throwError } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';
import { LoadingService } from '../services/loading.service';

export const appHttpInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const snackBar = inject(MatSnackBar);

  const token = authService.getToken();
  const clonedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  loadingService.begin();

  return next(clonedRequest).pipe(
    catchError((error: unknown) => {
      const message =
        error instanceof HttpErrorResponse
          ? error.error?.message || 'Erro de comunicacao com o servidor.'
          : 'Erro inesperado na requisicao.';
      snackBar.open(message, 'Fechar', { duration: 3500 });
      return throwError(() => error);
    }),
    finalize(() => loadingService.end())
  );
};
