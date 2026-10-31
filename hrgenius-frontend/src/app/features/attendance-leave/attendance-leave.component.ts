import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../core/services/attendance.service';
import { LeaveService } from '../../core/services/leave.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { Attendance, AttendanceCreatePayload, AttendanceUpdatePayload } from '../../core/models/attendance.model';
import { LeaveRequest, LeaveType, LeaveBalance, LeaveRequestCreatePayload } from '../../core/models/leave.model';
import { Employee, Department } from '../../core/models/employee.model';

@Component({
  selector: 'app-attendance-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-leave.component.html',
  styleUrls: ['./attendance-leave.component.scss']
})
export class AttendanceLeaveComponent implements OnInit {
  protected readonly attendanceService = inject(AttendanceService);
  protected readonly leaveService = inject(LeaveService);
  protected readonly employeeService = inject(EmployeeService);
  protected readonly authService = inject(AuthService);

  // Active Main Tab
  protected activeTab = signal<'attendance' | 'leave-requests' | 'leave-balances' | 'leave-types'>('attendance');

  // Common UI State
  protected isLoading = signal<boolean>(false);
  protected alertMessage = signal<{ type: 'success' | 'danger'; text: string } | null>(null);

  // Shared Reference Data
  protected employees = signal<Employee[]>([]);
  protected departments = signal<Department[]>([]);
  protected leaveTypes = signal<LeaveType[]>([]);

  // ==========================================
  // TAB 1: ATTENDANCE STATE
  // ==========================================
  protected attendanceRecords = signal<Attendance[]>([]);
  protected filterDate = new Date().toISOString().substring(0, 10);
  protected filterEmpId: number | null = null;
  protected filterDeptId: number | null = null;
  protected filterStatus = '';

  // Quick Clock state for logged-in user
  protected myTodayAttendance = signal<Attendance | null>(null);

  // Manual Attendance Modal
  protected showAttendanceModal = signal<boolean>(false);
  protected isEditingAttendance = signal<boolean>(false);
  protected editingAttendanceId: number | null = null;
  protected attendanceForm: AttendanceCreatePayload = {
    employeeId: 0,
    attendanceDate: new Date().toISOString().substring(0, 10),
    status: 'PRESENT',
    checkInTime: '09:00',
    checkOutTime: '17:30',
    remarks: ''
  };

  // ==========================================
  // TAB 2: LEAVE REQUESTS STATE
  // ==========================================
  protected leaveRequests = signal<LeaveRequest[]>([]);
  protected leaveFilterScope = signal<'my' | 'team' | 'all'>('my');
  protected leaveFilterStatus = '';
  protected leaveFilterTypeId: number | null = null;

  // Apply Leave Modal
  protected showApplyLeaveModal = signal<boolean>(false);
  protected applyLeaveForm = {
    employeeId: 0,
    leaveTypeId: 0,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    reason: ''
  };

  // Calculated days for apply form
  protected calculatedLeaveDays = computed(() => {
    try {
      const start = new Date(this.applyLeaveForm.startDate);
      const end = new Date(this.applyLeaveForm.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        return 0;
      }
      return Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    } catch {
      return 0;
    }
  });

  // Rejection Dialog Modal
  protected showRejectModal = signal<boolean>(false);
  protected rejectTargetRequestId: number | null = null;
  protected rejectionReasonInput = '';

  // ==========================================
  // TAB 3: LEAVE BALANCES STATE
  // ==========================================
  protected leaveBalances = signal<LeaveBalance[]>([]);
  protected selectedBalanceEmployeeId: number | null = null;

  // ==========================================
  // TAB 4: LEAVE TYPES CATALOG STATE
  // ==========================================
  protected showLeaveTypeModal = signal<boolean>(false);
  protected isEditingLeaveType = signal<boolean>(false);
  protected editingLeaveTypeId: number | null = null;
  protected leaveTypeForm = {
    name: '',
    description: '',
    annualAllocation: 12,
    isActive: 1
  };

  ngOnInit(): void {
    this.initDefaultScope();
    this.loadReferenceData();
    this.loadAttendanceData();
    this.loadLeaveRequests();
    this.loadLeaveBalances();
  }

  private initDefaultScope(): void {
    if (this.authService.isAdmin()) {
      this.leaveFilterScope.set('all');
    } else if (this.authService.isManager()) {
      this.leaveFilterScope.set('team');
    } else {
      this.leaveFilterScope.set('my');
    }

    const currentEmpId = this.authService.currentUser()?.employeeId;
    if (currentEmpId) {
      this.selectedBalanceEmployeeId = currentEmpId;
      this.applyLeaveForm.employeeId = currentEmpId;
    }
  }

  // ==========================================
  // REFERENCE DATA
  // ==========================================
  loadReferenceData(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.employees.set(res.data);
          if (!this.applyLeaveForm.employeeId && res.data.length > 0) {
            this.applyLeaveForm.employeeId = res.data[0].id;
          }
        }
      }
    });

    this.employeeService.getDepartments(true).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.departments.set(res.data);
        }
      }
    });

    this.leaveService.getLeaveTypes().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.leaveTypes.set(res.data);
          if (!this.applyLeaveForm.leaveTypeId && res.data.length > 0) {
            this.applyLeaveForm.leaveTypeId = res.data[0].id;
          }
        }
      }
    });
  }

  // ==========================================
  // ATTENDANCE METHODS
  // ==========================================
  loadAttendanceData(): void {
    this.isLoading.set(true);
    this.attendanceService.getAttendance({
      date: this.filterDate || undefined,
      employeeId: this.filterEmpId || undefined,
      departmentId: this.filterDeptId || undefined,
      status: this.filterStatus || undefined
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.attendanceRecords.set(res.data);
          this.checkMyTodayAttendance(res.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err.error?.message || 'Failed to load attendance records');
      }
    });
  }

  private checkMyTodayAttendance(records: Attendance[]): void {
    const currentEmpId = this.authService.currentUser()?.employeeId;
    const today = new Date().toISOString().substring(0, 10);
    if (currentEmpId && this.filterDate === today) {
      const mine = records.find(r => r.employeeId === currentEmpId);
      this.myTodayAttendance.set(mine || null);
    }
  }

  clearDateFilter(): void {
    this.filterDate = '';
    this.loadAttendanceData();
  }

  setTodayFilter(): void {
    this.filterDate = new Date().toISOString().substring(0, 10);
    this.loadAttendanceData();
  }

  openAddAttendanceModal(): void {
    this.isEditingAttendance.set(false);
    this.editingAttendanceId = null;
    const firstEmp = this.employees()[0]?.id || 0;
    this.attendanceForm = {
      employeeId: firstEmp,
      attendanceDate: this.filterDate || new Date().toISOString().substring(0, 10),
      status: 'PRESENT',
      checkInTime: '09:00',
      checkOutTime: '17:30',
      remarks: ''
    };
    this.showAttendanceModal.set(true);
  }

  openEditAttendanceModal(record: Attendance): void {
    this.isEditingAttendance.set(true);
    this.editingAttendanceId = record.id;
    this.attendanceForm = {
      employeeId: record.employeeId,
      attendanceDate: record.attendanceDate,
      status: record.status,
      checkInTime: record.checkInTime || '',
      checkOutTime: record.checkOutTime || '',
      remarks: record.remarks || ''
    };
    this.showAttendanceModal.set(true);
  }

  saveAttendance(): void {
    if (this.isEditingAttendance() && this.editingAttendanceId) {
      const updatePayload: AttendanceUpdatePayload = {
        status: this.attendanceForm.status,
        checkInTime: this.attendanceForm.checkInTime || undefined,
        checkOutTime: this.attendanceForm.checkOutTime || undefined,
        remarks: this.attendanceForm.remarks || undefined
      };
      this.attendanceService.updateAttendance(this.editingAttendanceId, updatePayload).subscribe({
        next: (res) => {
          this.showAttendanceModal.set(false);
          this.showAlert('success', 'Attendance record updated successfully');
          this.loadAttendanceData();
        },
        error: (err) => {
          this.showAlert('danger', err.error?.message || 'Failed to update attendance');
        }
      });
    } else {
      this.attendanceService.recordAttendance(this.attendanceForm).subscribe({
        next: (res) => {
          this.showAttendanceModal.set(false);
          this.showAlert('success', 'Attendance recorded successfully');
          this.loadAttendanceData();
        },
        error: (err) => {
          this.showAlert('danger', err.error?.message || 'Failed to record attendance');
        }
      });
    }
  }

  deleteAttendance(id: number): void {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    this.attendanceService.deleteAttendance(id).subscribe({
      next: () => {
        this.showAlert('success', 'Attendance record deleted');
        this.loadAttendanceData();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to delete attendance record');
      }
    });
  }

  // Quick Clock-in / Clock-out for logged in user
  clockInNow(): void {
    const currentEmpId = this.authService.currentUser()?.employeeId;
    if (!currentEmpId) {
      this.showAlert('danger', 'Your user account is not linked to an employee profile.');
      return;
    }

    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:mm
    const today = now.toISOString().substring(0, 10);

    const payload: AttendanceCreatePayload = {
      employeeId: currentEmpId,
      attendanceDate: today,
      status: 'PRESENT',
      checkInTime: currentTime,
      remarks: 'Self Clock-In via Corporate Portal'
    };

    this.attendanceService.recordAttendance(payload).subscribe({
      next: () => {
        this.showAlert('success', `Clock-in recorded at ${currentTime}`);
        this.loadAttendanceData();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to clock in');
      }
    });
  }

  clockOutNow(): void {
    const mine = this.myTodayAttendance();
    if (!mine) return;

    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);

    this.attendanceService.updateAttendance(mine.id, {
      status: mine.status,
      checkInTime: mine.checkInTime,
      checkOutTime: currentTime,
      remarks: (mine.remarks ? mine.remarks + ' | ' : '') + `Clocked out at ${currentTime}`
    }).subscribe({
      next: () => {
        this.showAlert('success', `Clock-out recorded at ${currentTime}`);
        this.loadAttendanceData();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to clock out');
      }
    });
  }

  // ==========================================
  // LEAVE REQUESTS METHODS
  // ==========================================
  loadLeaveRequests(): void {
    this.isLoading.set(true);
    const scope = this.leaveFilterScope();
    const currentEmpId = this.authService.currentUser()?.employeeId;

    if (scope === 'my' && currentEmpId) {
      this.leaveService.getEmployeeLeaveRequests(currentEmpId).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.success && res.data) {
            this.leaveRequests.set(this.applyLeaveFilters(res.data));
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.showAlert('danger', err.error?.message || 'Failed to load leave requests');
        }
      });
    } else if (scope === 'team' && currentEmpId) {
      this.leaveService.getTeamLeaveRequests(currentEmpId).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.success && res.data) {
            this.leaveRequests.set(this.applyLeaveFilters(res.data));
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.showAlert('danger', err.error?.message || 'Failed to load team leave requests');
        }
      });
    } else {
      this.leaveService.getLeaveRequests({
        status: this.leaveFilterStatus || undefined,
        leaveTypeId: this.leaveFilterTypeId || undefined
      }).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.success && res.data) {
            this.leaveRequests.set(res.data);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.showAlert('danger', err.error?.message || 'Failed to load leave requests');
        }
      });
    }
  }

  private applyLeaveFilters(list: LeaveRequest[]): LeaveRequest[] {
    let result = list;
    if (this.leaveFilterStatus) {
      result = result.filter(r => r.status === this.leaveFilterStatus);
    }
    if (this.leaveFilterTypeId) {
      result = result.filter(r => r.leaveTypeId === this.leaveFilterTypeId);
    }
    return result;
  }

  setLeaveScope(scope: 'my' | 'team' | 'all'): void {
    this.leaveFilterScope.set(scope);
    this.loadLeaveRequests();
  }

  openApplyLeaveModal(): void {
    const currentEmpId = this.authService.currentUser()?.employeeId || (this.employees()[0]?.id || 0);
    const firstType = this.leaveTypes()[0]?.id || 0;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().substring(0, 10);

    this.applyLeaveForm = {
      employeeId: currentEmpId,
      leaveTypeId: firstType,
      startDate: dateStr,
      endDate: dateStr,
      reason: ''
    };
    this.showApplyLeaveModal.set(true);
  }

  submitLeaveRequest(): void {
    if (!this.applyLeaveForm.reason.trim()) {
      this.showAlert('danger', 'Please provide a valid reason for your leave request.');
      return;
    }

    const payload: LeaveRequestCreatePayload = {
      employeeId: this.applyLeaveForm.employeeId,
      leaveTypeId: this.applyLeaveForm.leaveTypeId,
      startDate: this.applyLeaveForm.startDate,
      endDate: this.applyLeaveForm.endDate,
      reason: this.applyLeaveForm.reason.trim()
    };

    this.leaveService.createLeaveRequest(payload).subscribe({
      next: (res) => {
        this.showApplyLeaveModal.set(false);
        this.showAlert('success', 'Leave application submitted successfully for review.');
        this.loadLeaveRequests();
        this.loadLeaveBalances();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to submit leave request');
      }
    });
  }

  approveLeave(requestId: number): void {
    const currentEmpId = this.authService.currentUser()?.employeeId;
    this.leaveService.approveLeaveRequest(requestId, { approverEmployeeId: currentEmpId }).subscribe({
      next: () => {
        this.showAlert('success', 'Leave request approved and attendance muster roll updated.');
        this.loadLeaveRequests();
        this.loadAttendanceData();
        this.loadLeaveBalances();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to approve leave request');
      }
    });
  }

  openRejectModal(requestId: number): void {
    this.rejectTargetRequestId = requestId;
    this.rejectionReasonInput = '';
    this.showRejectModal.set(true);
  }

  confirmRejectLeave(): void {
    if (!this.rejectionReasonInput.trim()) {
      this.showAlert('danger', 'A reason is required when rejecting a leave request.');
      return;
    }
    if (!this.rejectTargetRequestId) return;

    const currentEmpId = this.authService.currentUser()?.employeeId;
    this.leaveService.rejectLeaveRequest(this.rejectTargetRequestId, {
      approverEmployeeId: currentEmpId,
      rejectionReason: this.rejectionReasonInput.trim()
    }).subscribe({
      next: () => {
        this.showRejectModal.set(false);
        this.showAlert('success', 'Leave request has been rejected.');
        this.loadLeaveRequests();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to reject leave request');
      }
    });
  }

  cancelLeave(requestId: number): void {
    if (!confirm('Are you sure you want to cancel this pending leave application?')) return;
    const currentEmpId = this.authService.currentUser()?.employeeId;
    this.leaveService.cancelLeaveRequest(requestId, currentEmpId).subscribe({
      next: () => {
        this.showAlert('success', 'Leave request cancelled.');
        this.loadLeaveRequests();
        this.loadLeaveBalances();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to cancel leave request');
      }
    });
  }

  // ==========================================
  // LEAVE BALANCES METHODS
  // ==========================================
  loadLeaveBalances(): void {
    const empId = this.selectedBalanceEmployeeId || this.authService.currentUser()?.employeeId;
    if (!empId) return;

    this.leaveService.getLeaveBalances(empId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.leaveBalances.set(res.data);
        }
      },
      error: (err) => {
        console.error('Failed to load leave balances', err);
      }
    });
  }

  onBalanceEmployeeChange(empId: number): void {
    this.selectedBalanceEmployeeId = empId;
    this.loadLeaveBalances();
  }

  // ==========================================
  // LEAVE TYPES CATALOG METHODS
  // ==========================================
  openAddLeaveTypeModal(): void {
    this.isEditingLeaveType.set(false);
    this.editingLeaveTypeId = null;
    this.leaveTypeForm = {
      name: '',
      description: '',
      annualAllocation: 12,
      isActive: 1
    };
    this.showLeaveTypeModal.set(true);
  }

  openEditLeaveTypeModal(lt: LeaveType): void {
    this.isEditingLeaveType.set(true);
    this.editingLeaveTypeId = lt.id;
    this.leaveTypeForm = {
      name: lt.name,
      description: lt.description || '',
      annualAllocation: lt.annualAllocation,
      isActive: lt.isActive
    };
    this.showLeaveTypeModal.set(true);
  }

  saveLeaveType(): void {
    if (!this.leaveTypeForm.name.trim()) {
      this.showAlert('danger', 'Leave type name is required.');
      return;
    }

    if (this.isEditingLeaveType() && this.editingLeaveTypeId) {
      this.leaveService.updateLeaveType(this.editingLeaveTypeId, this.leaveTypeForm).subscribe({
        next: () => {
          this.showLeaveTypeModal.set(false);
          this.showAlert('success', 'Leave type updated successfully');
          this.loadReferenceData();
          this.loadLeaveBalances();
        },
        error: (err) => {
          this.showAlert('danger', err.error?.message || 'Failed to update leave type');
        }
      });
    } else {
      this.leaveService.createLeaveType(this.leaveTypeForm).subscribe({
        next: () => {
          this.showLeaveTypeModal.set(false);
          this.showAlert('success', 'Leave type created successfully');
          this.loadReferenceData();
          this.loadLeaveBalances();
        },
        error: (err) => {
          this.showAlert('danger', err.error?.message || 'Failed to create leave type');
        }
      });
    }
  }

  deleteLeaveType(id: number): void {
    if (!confirm('Are you sure you want to deactivate this leave type?')) return;
    this.leaveService.deleteLeaveType(id).subscribe({
      next: () => {
        this.showAlert('success', 'Leave type deactivated');
        this.loadReferenceData();
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to deactivate leave type');
      }
    });
  }

  // ==========================================
  // HELPERS
  // ==========================================
  showAlert(type: 'success' | 'danger', text: string): void {
    this.alertMessage.set({ type, text });
    setTimeout(() => this.alertMessage.set(null), 6000);
  }

  getEmployeeName(empId: number): string {
    const e = this.employees().find(emp => emp.id === empId);
    return e ? `${e.fullName} (${e.employeeCode})` : `Emp #${empId}`;
  }

  canApproveOrReject(request: LeaveRequest): boolean {
    if (request.status !== 'PENDING') return false;
    const currentEmpId = this.authService.currentUser()?.employeeId;
    // Cannot approve own leave
    if (currentEmpId && request.employeeId === currentEmpId) return false;
    return this.authService.isAdmin() || this.authService.isManager();
  }

  canCancel(request: LeaveRequest): boolean {
    if (request.status !== 'PENDING') return false;
    const currentEmpId = this.authService.currentUser()?.employeeId;
    return (currentEmpId && request.employeeId === currentEmpId) || this.authService.isAdmin();
  }
}
