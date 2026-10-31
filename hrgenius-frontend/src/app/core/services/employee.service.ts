import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import {
  Department,
  Designation,
  Employee,
  EmployeeSummary,
  EmployeeCreatePayload,
  EmployeeUpdatePayload
} from '../models/employee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // --- Employees ---
  getEmployees(keyword?: string, departmentId?: number, status?: string): Observable<ApiResponse<Employee[]>> {
    let params = new HttpParams();
    if (keyword && keyword.trim()) params = params.set('keyword', keyword.trim());
    if (departmentId) params = params.set('departmentId', departmentId.toString());
    if (status && status.trim()) params = params.set('status', status.trim());

    return this.http.get<ApiResponse<Employee[]>>(`${this.baseUrl}/employees`, { params });
  }

  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.baseUrl}/employees/${id}`);
  }

  getManagers(): Observable<ApiResponse<EmployeeSummary[]>> {
    return this.http.get<ApiResponse<EmployeeSummary[]>>(`${this.baseUrl}/employees/managers`);
  }

  createEmployee(payload: EmployeeCreatePayload): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.baseUrl}/employees`, payload);
  }

  updateEmployee(id: number, payload: EmployeeUpdatePayload): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.baseUrl}/employees/${id}`, payload);
  }

  toggleEmployeeStatus(id: number, status: string): Observable<ApiResponse<Employee>> {
    return this.http.patch<ApiResponse<Employee>>(`${this.baseUrl}/employees/${id}/status`, { status });
  }

  // --- Departments ---
  getDepartments(activeOnly: boolean = false): Observable<ApiResponse<Department[]>> {
    const params = new HttpParams().set('activeOnly', activeOnly.toString());
    return this.http.get<ApiResponse<Department[]>>(`${this.baseUrl}/departments`, { params });
  }

  createDepartment(dept: { deptCode: string; deptName: string; description?: string }): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(`${this.baseUrl}/departments`, dept);
  }

  updateDepartment(id: number, dept: { deptCode: string; deptName: string; description?: string }): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(`${this.baseUrl}/departments/${id}`, dept);
  }

  deleteDepartment(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/departments/${id}`);
  }

  // --- Designations ---
  getDesignations(departmentId?: number): Observable<ApiResponse<Designation[]>> {
    let params = new HttpParams();
    if (departmentId) params = params.set('departmentId', departmentId.toString());
    return this.http.get<ApiResponse<Designation[]>>(`${this.baseUrl}/designations`, { params });
  }

  createDesignation(desig: { title: string; bandLevel?: string; departmentId: number }): Observable<ApiResponse<Designation>> {
    return this.http.post<ApiResponse<Designation>>(`${this.baseUrl}/designations`, desig);
  }

  updateDesignation(id: number, desig: { title: string; bandLevel?: string; departmentId: number }): Observable<ApiResponse<Designation>> {
    return this.http.put<ApiResponse<Designation>>(`${this.baseUrl}/designations/${id}`, desig);
  }

  deleteDesignation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/designations/${id}`);
  }
}
