import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BookingService } from 'src/app/core/services/booking.service';
import { catchError, map, take } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';
import { of } from 'rxjs';

interface ServiceItem {
  title: string;
  duration: string;
  price: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatListModule],
})
export class ServicesComponent {
  private bookingService = inject(BookingService);
  private loadingService = inject(LoadingService);
  readonly services$ = this.bookingService.getServiceOptions$().pipe(
    map((services) => services.map((service) => ({
      title: service.name,
      duration: `${service.durationMinutes} min`,
      price: `R$ ${service.price.toFixed(2)}`,
    }))),
  );
  readonly loading$ = this.loadingService.isLoading$;
  readonly services = this.services$.pipe(take(1));
  readonly loading = this.loading$.pipe(take(1));
  
}
