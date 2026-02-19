import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequestsSubject = new BehaviorSubject<number>(0);

  readonly isLoading$ = this.activeRequestsSubject.asObservable().pipe(map((count) => count > 0));

  begin(): void {
    this.activeRequestsSubject.next(this.activeRequestsSubject.value + 1);
  }

  end(): void {
    this.activeRequestsSubject.next(Math.max(this.activeRequestsSubject.value - 1, 0));
  }
}
