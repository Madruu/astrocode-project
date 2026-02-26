import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/pages/landing/landing.component').then((m) => m.LandingComponent),
  },
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
    path: 'provider-dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/provider-dashboard/provider-dashboard.component').then(
        (m) => m.ProviderDashboardComponent
      ),
  },
  {
    path: 'services',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/services/pages/services/services.component').then((m) => m.ServicesComponent),
  },
  {
    path: 'schedule',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/schedule/pages/schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/calendar/pages/calendar/calendar.component').then((m) => m.CalendarComponent),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/account/pages/account/account.component').then((m) => m.AccountComponent),
  },
  { path: '**', redirectTo: '' },
];
