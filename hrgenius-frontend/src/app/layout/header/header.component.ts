import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HealthService } from '../../core/services/health.service';
import { BackendHealth } from '../../core/models/api-response.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly healthService = inject(HealthService);
  private readonly router = inject(Router);

  protected readonly backendHealth = signal<BackendHealth | null>(null);
  protected readonly isCheckingHealth = signal<boolean>(true);

  ngOnInit(): void {
    this.refreshHealth();
  }

  refreshHealth(): void {
    this.isCheckingHealth.set(true);
    this.healthService.checkBackendHealth().subscribe({
      next: (health) => {
        this.backendHealth.set(health);
        this.isCheckingHealth.set(false);
      },
      error: () => {
        this.backendHealth.set(null);
        this.isCheckingHealth.set(false);
      }
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
