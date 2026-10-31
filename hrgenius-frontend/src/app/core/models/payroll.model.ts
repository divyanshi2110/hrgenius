export interface SalaryStructure {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  designationTitle: string;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyanceAllowance: number;
  grossSalary: number;
  epfDeduction: number;
  professionalTax: number;
  tdsDeduction: number;
  totalDeductions: number;
  netSalary: number;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  panNumber?: string;
  updatedAt?: string;
}

export interface SalaryStructureRequest {
  employeeId: number;
  basicSalary: number;
  hra: number;
  specialAllowance?: number;
  conveyanceAllowance?: number;
  epfDeduction?: number;
  professionalTax?: number;
  tdsDeduction?: number;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  panNumber?: string;
}

export interface PayrollRecord {
  id: number;
  payrollCode: string;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  designationTitle: string;
  panNumber?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  payMonth: number;
  payYear: number;
  totalWorkingDays: number;
  paidDays: number;
  lopDays: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyanceAllowance: number;
  grossSalary: number;
  epfDeduction: number;
  professionalTax: number;
  tdsDeduction: number;
  lopDeduction: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryInWords: string;
  status: 'DRAFT' | 'GENERATED' | 'PAID';
  paymentDate?: string;
  createdAt: string;
}

export interface PayrollProcessRequest {
  employeeId?: number | null;
  payMonth: number;
  payYear: number;
  totalWorkingDays?: number;
  customLopDays?: number;
}
