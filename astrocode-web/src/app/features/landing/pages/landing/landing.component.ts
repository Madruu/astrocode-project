import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
})
export class LandingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly user$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
