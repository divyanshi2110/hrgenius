import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { DashboardSummary } from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getSummary(): Observable<ApiResponse<DashboardSummary>> {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.baseUrl}/summary`).pipe(
      catchError(() => {
        return of({
          success: true,
          statusCode: 200,
          message: 'Summary loaded (Cloud Demo Mode)',
          data: {
            totalEmployees: 16,
            activeEmployees: 16,
            totalDepartments: 8,
            todayAttendanceRate: 94.2,
            todayPresentCount: 15,
            todayOnLeaveCount: 1,
            todayAbsentCount: 0,
            pendingLeaveRequests: 3
          },
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
