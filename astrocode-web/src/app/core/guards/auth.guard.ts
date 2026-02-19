import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$().pipe(
    take(1),
    map((isAuthenticated) => (isAuthenticated ? true : router.createUrlTree(['/login'])))
  );
};
