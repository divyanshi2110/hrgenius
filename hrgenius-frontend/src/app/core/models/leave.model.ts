export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  annualAllocation: number;
  isActive: number;
  createdAt?: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  designationTitle?: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedById?: number;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface LeaveBalance {
  leaveTypeId: number;
  leaveTypeName: string;
  annualAllocation: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveRequestCreatePayload {
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveActionPayload {
  approverEmployeeId?: number;
  rejectionReason?: string;
}
