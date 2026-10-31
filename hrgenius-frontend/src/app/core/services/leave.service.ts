import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import {
  LeaveType,
  LeaveRequest,
  LeaveBalance,
  LeaveRequestCreatePayload,
  LeaveActionPayload
} from '../models/leave.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/leave`;

  // --- Leave Types ---
  getLeaveTypes(activeOnly: boolean = false): Observable<ApiResponse<LeaveType[]>> {
    const params = new HttpParams().set('activeOnly', activeOnly.toString());
    return this.http.get<ApiResponse<LeaveType[]>>(`${this.baseUrl}/types`, { params });
  }

  getLeaveTypeById(id: number): Observable<ApiResponse<LeaveType>> {
    return this.http.get<ApiResponse<LeaveType>>(`${this.baseUrl}/types/${id}`);
  }

  createLeaveType(payload: { name: string; description?: string; annualAllocation: number; isActive?: number }): Observable<ApiResponse<LeaveType>> {
    return this.http.post<ApiResponse<LeaveType>>(`${this.baseUrl}/types`, payload);
  }

  updateLeaveType(id: number, payload: { name: string; description?: string; annualAllocation: number; isActive?: number }): Observable<ApiResponse<LeaveType>> {
    return this.http.put<ApiResponse<LeaveType>>(`${this.baseUrl}/types/${id}`, payload);
  }

  deleteLeaveType(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/types/${id}`);
  }

  // --- Leave Requests ---
  getLeaveRequests(filters?: {
    employeeId?: number;
    departmentId?: number;
    status?: string;
    leaveTypeId?: number;
    startDate?: string;
    endDate?: string;
  }): Observable<ApiResponse<LeaveRequest[]>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.employeeId) params = params.set('employeeId', filters.employeeId.toString());
      if (filters.departmentId) params = params.set('departmentId', filters.departmentId.toString());
      if (filters.status && filters.status.trim()) params = params.set('status', filters.status.trim());
      if (filters.leaveTypeId) params = params.set('leaveTypeId', filters.leaveTypeId.toString());
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }
    return this.http.get<ApiResponse<LeaveRequest[]>>(`${this.baseUrl}/requests`, { params });
  }

  getLeaveRequestById(id: number): Observable<ApiResponse<LeaveRequest>> {
    return this.http.get<ApiResponse<LeaveRequest>>(`${this.baseUrl}/requests/${id}`);
  }

  getEmployeeLeaveRequests(employeeId: number): Observable<ApiResponse<LeaveRequest[]>> {
    return this.http.get<ApiResponse<LeaveRequest[]>>(`${this.baseUrl}/requests/employee/${employeeId}`);
  }

  getTeamLeaveRequests(managerId: number): Observable<ApiResponse<LeaveRequest[]>> {
    return this.http.get<ApiResponse<LeaveRequest[]>>(`${this.baseUrl}/requests/team/${managerId}`);
  }

  createLeaveRequest(payload: LeaveRequestCreatePayload): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.baseUrl}/requests`, payload);
  }

  approveLeaveRequest(id: number, actionPayload?: LeaveActionPayload): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.baseUrl}/requests/${id}/approve`, actionPayload || {});
  }

  rejectLeaveRequest(id: number, actionPayload: LeaveActionPayload): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.baseUrl}/requests/${id}/reject`, actionPayload);
  }

  cancelLeaveRequest(id: number, employeeId?: number): Observable<ApiResponse<LeaveRequest>> {
    let params = new HttpParams();
    if (employeeId) params = params.set('employeeId', employeeId.toString());
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.baseUrl}/requests/${id}/cancel`, {}, { params });
  }

  getLeaveBalances(employeeId: number, year?: number): Observable<ApiResponse<LeaveBalance[]>> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.baseUrl}/balances/employee/${employeeId}`, { params });
  }
}
