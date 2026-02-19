import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

interface SignupResponse {
  accessToken: string;
  user: AuthUser;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly tokenKey = 'token';
  private readonly userKey = 'auth_user';
  private readonly mockAccount = {
    email: 'demo@astrocode.com',
    password: '123456',
    user: {
      id: 'user-001',
      name: 'Conta Demo',
      email: 'demo@astrocode.com',
    } satisfies AuthUser,
  };
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readUserFromStorage());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>('/api/login', credentials)
      .pipe(
        catchError(() => {
          if (
            credentials.email !== this.mockAccount.email ||
            credentials.password !== this.mockAccount.password
          ) {
            return throwError(() => new Error('Email ou senha invalidos para a conta mock.'));
          }

          const fallbackResponse: LoginResponse = {
            accessToken: `mock-jwt-${Date.now()}`,
            user: this.mockAccount.user,
          };

          return of(fallbackResponse);
        }),
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.accessToken);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        map((response) => response.user)
      );
  }

  signup(credentials: { email: string; password: string }): Observable<AuthUser> {
    return this.http
      .post<SignupResponse>('/api/signup', {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Erro ao criar conta'));
        }),
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.accessToken);
        }),
        map((response) => response.user)
      );
  }

  getMockCredentials(): { email: string; password: string } {
    return { email: this.mockAccount.email, password: this.mockAccount.password };
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }

  private readUserFromStorage(): AuthUser | null {
    const userRaw = localStorage.getItem(this.userKey);
    if (!userRaw) {
      return null;
    }

    try {
      return JSON.parse(userRaw) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
