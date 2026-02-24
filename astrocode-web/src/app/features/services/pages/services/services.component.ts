import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BookingService } from 'src/app/core/services/booking.service';
import { catchError, map, take } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';
import { of } from 'rxjs';
import { ServiceDetailsComponent } from '../../components/service-details/service-details.component';

interface ServiceItem {
  id: string;
  title: string;
  duration: string;
  price: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatListModule],
})
export class ServicesComponent {
  private bookingService = inject(BookingService);
  private loadingService = inject(LoadingService);
  private dialog = inject(MatDialog);
  readonly services$ = this.bookingService.getServiceOptions$().pipe(
    map((services) => services.map((service) => ({
      id: service.id,
      title: service.name,
      duration: `${service.durationMinutes} min`,
      price: `R$ ${service.price.toFixed(2)}`,
    }))),
  );
  readonly loading$ = this.loadingService.isLoading$;
  readonly services = this.services$.pipe(take(1));
  readonly loading = this.loading$.pipe(take(1));

  openServiceDetails(service: ServiceItem): void {
    this.dialog.open(ServiceDetailsComponent, {
      width: '480px',
      data: service,
    });
  }
}
