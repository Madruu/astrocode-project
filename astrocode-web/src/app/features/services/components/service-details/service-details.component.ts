import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

export interface ServiceDetailsDialogData {
  id: string;
  title: string;
  duration: string;
  price: string;
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
})
export class ServiceDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: ServiceDetailsDialogData) {}
}
