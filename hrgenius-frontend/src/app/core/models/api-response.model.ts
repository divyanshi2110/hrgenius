export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface BackendHealth {
  application: string;
  status: string;
  version: string;
  phase: string;
  timestamp: string;
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_EMPLOYEE';
  employeeId?: number;
  employeeCode?: string;
  fullName: string;
  departmentName?: string;
  designationTitle?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserSummary;
}
