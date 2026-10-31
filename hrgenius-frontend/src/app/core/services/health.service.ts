import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse, BackendHealth } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/health`;

  checkBackendHealth(): Observable<BackendHealth | null> {
    return this.http.get<ApiResponse<BackendHealth>>(this.apiUrl).pipe(
      map(response => response.success ? response.data : null),
      catchError(err => {
        console.warn('Backend health check could not connect:', err.message);
        return of(null);
      })
    );
  }
}
