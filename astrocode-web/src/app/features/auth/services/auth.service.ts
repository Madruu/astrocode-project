import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(credentials: { email: string; password: string }): Observable<LoginResponse['user']> {
    return this.http
      .post<LoginResponse>('/api/login', credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.accessToken);
        }),
        map(response => response.user)
      );
  }
}
