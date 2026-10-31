export interface Department {
  id: number;
  deptCode: string;
  deptName: string;
  description?: string;
  isActive: number;
  createdAt?: string;
}

export interface Designation {
  id: number;
  title: string;
  bandLevel?: string;
  departmentId?: number;
  departmentName?: string;
  isActive: number;
  createdAt?: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  departmentId?: number;
  departmentCode?: string;
  departmentName?: string;
  designationId?: number;
  designationTitle?: string;
  bandLevel?: string;
  managerId?: number;
  managerEmployeeCode?: string;
  managerName?: string;
  userId?: number;
  username?: string;
  userRole?: string;
  createdAt?: string;
}

export interface EmployeeSummary {
  id: number;
  employeeCode: string;
  fullName: string;
  departmentName: string;
  designationTitle: string;
}

export interface EmployeeCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: string;
  departmentId: number;
  designationId: number;
  managerId?: number | null;
  createUserAccount: boolean;
  role: string;
}

export interface EmployeeUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: string;
  departmentId: number;
  designationId: number;
  managerId?: number | null;
  status: string;
}
