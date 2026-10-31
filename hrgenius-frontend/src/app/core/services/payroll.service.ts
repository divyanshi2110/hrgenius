import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { PayrollRecord, PayrollProcessRequest, SalaryStructure, SalaryStructureRequest } from '../models/payroll.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/v1/payroll';

  getPayrolls(params?: { employeeId?: number; month?: number; year?: number; status?: string }): Observable<ApiResponse<PayrollRecord[]>> {
    let httpParams = new HttpParams();
    if (params?.employeeId) httpParams = httpParams.set('employeeId', params.employeeId.toString());
    if (params?.month) httpParams = httpParams.set('month', params.month.toString());
    if (params?.year) httpParams = httpParams.set('year', params.year.toString());
    if (params?.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<ApiResponse<PayrollRecord[]>>(this.baseUrl, { params: httpParams });
  }

  getPayrollById(id: number): Observable<ApiResponse<PayrollRecord>> {
    return this.http.get<ApiResponse<PayrollRecord>>(`${this.baseUrl}/${id}`);
  }

  getPayrollsByEmployeeId(employeeId: number): Observable<ApiResponse<PayrollRecord[]>> {
    return this.http.get<ApiResponse<PayrollRecord[]>>(`${this.baseUrl}/employee/${employeeId}`);
  }

  processPayroll(request: PayrollProcessRequest): Observable<ApiResponse<PayrollRecord[]>> {
    return this.http.post<ApiResponse<PayrollRecord[]>>(`${this.baseUrl}/process`, request);
  }

  updatePayrollStatus(id: number, status: string): Observable<ApiResponse<PayrollRecord>> {
    return this.http.patch<ApiResponse<PayrollRecord>>(`${this.baseUrl}/${id}/status`, { status });
  }

  getAllSalaryStructures(): Observable<ApiResponse<SalaryStructure[]>> {
    return this.http.get<ApiResponse<SalaryStructure[]>>(`${this.baseUrl}/salary-structures`);
  }

  getSalaryStructureByEmployeeId(employeeId: number): Observable<ApiResponse<SalaryStructure>> {
    return this.http.get<ApiResponse<SalaryStructure>>(`${this.baseUrl}/salary-structures/employee/${employeeId}`);
  }

  saveSalaryStructure(request: SalaryStructureRequest): Observable<ApiResponse<SalaryStructure>> {
    return this.http.post<ApiResponse<SalaryStructure>>(`${this.baseUrl}/salary-structures`, request);
  }
}
