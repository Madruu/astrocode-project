import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/pages/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'services',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/services/pages/services/services.component').then((m) => m.ServicesComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
