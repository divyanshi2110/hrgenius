import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Attendance, AttendanceCreatePayload, AttendanceUpdatePayload } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/v1/attendance';

  getAttendance(filters?: {
    employeeId?: number;
    departmentId?: number;
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<ApiResponse<Attendance[]>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.employeeId) params = params.set('employeeId', filters.employeeId.toString());
      if (filters.departmentId) params = params.set('departmentId', filters.departmentId.toString());
      if (filters.status && filters.status.trim()) params = params.set('status', filters.status.trim());
      if (filters.date) params = params.set('date', filters.date);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }
    return this.http.get<ApiResponse<Attendance[]>>(this.baseUrl, { params });
  }

  getAttendanceById(id: number): Observable<ApiResponse<Attendance>> {
    return this.http.get<ApiResponse<Attendance>>(`${this.baseUrl}/${id}`);
  }

  getAttendanceByEmployeeId(employeeId: number): Observable<ApiResponse<Attendance[]>> {
    return this.http.get<ApiResponse<Attendance[]>>(`${this.baseUrl}/employee/${employeeId}`);
  }

  recordAttendance(payload: AttendanceCreatePayload): Observable<ApiResponse<Attendance>> {
    return this.http.post<ApiResponse<Attendance>>(this.baseUrl, payload);
  }

  updateAttendance(id: number, payload: AttendanceUpdatePayload): Observable<ApiResponse<Attendance>> {
    return this.http.put<ApiResponse<Attendance>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteAttendance(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
