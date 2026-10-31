export interface Attendance {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  designationTitle?: string;
  attendanceDate: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'WORK_FROM_HOME' | 'HALF_DAY' | 'ON_LEAVE';
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  workHours?: number;
  remarks?: string;
  createdAt: string;
}

export interface AttendanceCreatePayload {
  employeeId: number;
  attendanceDate: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface AttendanceUpdatePayload {
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}
