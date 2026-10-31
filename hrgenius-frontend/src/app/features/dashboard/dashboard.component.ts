import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HealthService } from '../../core/services/health.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { BackendHealth } from '../../core/models/api-response.model';
import { DashboardSummary } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly healthService = inject(HealthService);
  private readonly dashboardService = inject(DashboardService);

  protected readonly backendHealth = signal<BackendHealth | null>(null);
  protected readonly dashboardSummary = signal<DashboardSummary | null>(null);
  protected readonly isChecking = signal<boolean>(true);
  protected readonly currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.checkHealth();
    this.fetchSummary();
  }

  checkHealth(): void {
    this.isChecking.set(true);
    this.healthService.checkBackendHealth().subscribe({
      next: (data) => {
        this.backendHealth.set(data);
        this.isChecking.set(false);
      },
      error: () => {
        this.backendHealth.set(null);
        this.isChecking.set(false);
      }
    });
  }

  fetchSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dashboardSummary.set(res.data);
        }
      },
      error: (err) => {
        console.error('Failed to load dashboard summary metrics', err);
      }
    });
  }
}
