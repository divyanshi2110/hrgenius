import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../core/services/payroll.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { PayrollRecord, PayrollProcessRequest, SalaryStructure, SalaryStructureRequest } from '../../core/models/payroll.model';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  private readonly payrollService = inject(PayrollService);
  protected readonly authService = inject(AuthService);
  private readonly employeeService = inject(EmployeeService);

  // Active tab: records, process, structures
  protected readonly activeTab = signal<'records' | 'process' | 'structures'>('records');

  // Data signals
  protected readonly payrolls = signal<PayrollRecord[]>([]);
  protected readonly salaryStructures = signal<SalaryStructure[]>([]);
  protected readonly employees = signal<Employee[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly feedbackMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payslip modal state
  protected readonly selectedPayroll = signal<PayrollRecord | null>(null);
  protected readonly isPayslipOpen = signal<boolean>(false);

  // Structure edit state
  protected readonly isStructureModalOpen = signal<boolean>(false);
  protected readonly structureForm = signal<SalaryStructureRequest>({
    employeeId: 0,
    basicSalary: 0,
    hra: 0,
    specialAllowance: 0,
    conveyanceAllowance: 0,
    epfDeduction: 0,
    professionalTax: 200,
    tdsDeduction: 0,
    bankName: '',
    bankAccountNo: '',
    bankIfsc: '',
    panNumber: ''
  });
  protected readonly selectedEmployeeName = signal<string>('');

  // Filters for Records
  protected readonly filterMonth = signal<number>(10);
  protected readonly filterYear = signal<number>(2026);
  protected readonly filterStatus = signal<string>('');
  protected readonly searchKeyword = signal<string>('');

  // Process Payroll Form
  protected readonly processEmployeeId = signal<number | null>(null);
  protected readonly processMonth = signal<number>(10);
  protected readonly processYear = signal<number>(2026);
  protected readonly processDays = signal<number>(31);
  protected readonly processLopDays = signal<number>(0);
  protected readonly isProcessing = signal<boolean>(false);

  // Month list for dropdowns
  protected readonly months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  // Computed summary metrics
  protected readonly filteredPayrolls = computed(() => {
    const keyword = this.searchKeyword().toLowerCase().trim();
    return this.payrolls().filter(p => {
      if (!keyword) return true;
      return (
        p.employeeName.toLowerCase().includes(keyword) ||
        p.employeeCode.toLowerCase().includes(keyword) ||
        p.departmentName.toLowerCase().includes(keyword) ||
        p.payrollCode.toLowerCase().includes(keyword)
      );
    });
  });

  protected readonly totalDisbursed = computed(() => {
    return this.payrolls()
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.netSalary, 0);
  });

  protected readonly totalPending = computed(() => {
    return this.payrolls()
      .filter(p => p.status === 'GENERATED')
      .reduce((sum, p) => sum + p.netSalary, 0);
  });

  protected readonly totalRecordsCount = computed(() => this.payrolls().length);

  ngOnInit(): void {
    this.loadEmployees();
    this.loadData();
  }

  loadData(): void {
    this.loadPayrolls();
    if (this.authService.isAdmin() || this.authService.isManager()) {
      this.loadSalaryStructures();
    }
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(undefined, undefined, 'ACTIVE').subscribe({
      next: res => {
        if (res.success) {
          this.employees.set(res.data);
        }
      }
    });
  }

  loadPayrolls(): void {
    this.isLoading.set(true);
    const currentUser = this.authService.currentUser();
    const isEmployeeOnly = currentUser?.role === 'ROLE_EMPLOYEE';

    if (isEmployeeOnly && currentUser?.employeeId) {
      this.payrollService.getPayrollsByEmployeeId(currentUser.employeeId).subscribe({
        next: res => {
          this.isLoading.set(false);
          if (res.success) {
            this.payrolls.set(res.data);
          }
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.payrollService.getPayrolls({
        month: this.filterMonth() || undefined,
        year: this.filterYear() || undefined,
        status: this.filterStatus() || undefined
      }).subscribe({
        next: res => {
          this.isLoading.set(false);
          if (res.success) {
            this.payrolls.set(res.data);
          }
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  loadSalaryStructures(): void {
    this.payrollService.getAllSalaryStructures().subscribe({
      next: res => {
        if (res.success) {
          this.salaryStructures.set(res.data);
        }
      }
    });
  }

  setTab(tab: 'records' | 'process' | 'structures'): void {
    this.activeTab.set(tab);
    this.feedbackMessage.set(null);
  }

  openPayslip(record: PayrollRecord): void {
    this.selectedPayroll.set(record);
    this.isPayslipOpen.set(true);
  }

  closePayslip(): void {
    this.isPayslipOpen.set(false);
    this.selectedPayroll.set(null);
  }

  printPayslip(): void {
    window.print();
  }

  markAsPaid(id: number): void {
    this.payrollService.updatePayrollStatus(id, 'PAID').subscribe({
      next: res => {
        if (res.success) {
          this.feedbackMessage.set({ type: 'success', text: `Payroll marked as PAID for ${res.data.employeeName}` });
          this.loadPayrolls();
        }
      },
      error: err => {
        this.feedbackMessage.set({ type: 'error', text: err?.error?.message || 'Failed to update payroll status' });
      }
    });
  }

  processPayroll(): void {
    this.isProcessing.set(true);
    this.feedbackMessage.set(null);

    const payload: PayrollProcessRequest = {
      employeeId: this.processEmployeeId() ? Number(this.processEmployeeId()) : null,
      payMonth: Number(this.processMonth()),
      payYear: Number(this.processYear()),
      totalWorkingDays: Number(this.processDays()),
      customLopDays: Number(this.processLopDays())
    };

    this.payrollService.processPayroll(payload).subscribe({
      next: res => {
        this.isProcessing.set(false);
        if (res.success) {
          this.feedbackMessage.set({
            type: 'success',
            text: `Payroll successfully generated for ${res.data.length} employee record(s).`
          });
          this.loadPayrolls();
          this.activeTab.set('records');
        }
      },
      error: err => {
        this.isProcessing.set(false);
        this.feedbackMessage.set({
          type: 'error',
          text: err?.error?.message || 'Failed to process payroll. Verify salary structures are configured.'
        });
      }
    });
  }

  openEditStructure(structure?: SalaryStructure, emp?: Employee): void {
    if (structure) {
      this.selectedEmployeeName.set(structure.employeeName);
      this.structureForm.set({
        employeeId: structure.employeeId,
        basicSalary: structure.basicSalary,
        hra: structure.hra,
        specialAllowance: structure.specialAllowance,
        conveyanceAllowance: structure.conveyanceAllowance,
        epfDeduction: structure.epfDeduction,
        professionalTax: structure.professionalTax,
        tdsDeduction: structure.tdsDeduction,
        bankName: structure.bankName || '',
        bankAccountNo: structure.bankAccountNo || '',
        bankIfsc: structure.bankIfsc || '',
        panNumber: structure.panNumber || ''
      });
    } else if (emp) {
      this.selectedEmployeeName.set(emp.fullName);
      this.structureForm.set({
        employeeId: emp.id,
        basicSalary: 30000,
        hra: 12000,
        specialAllowance: 8000,
        conveyanceAllowance: 2000,
        epfDeduction: 3600,
        professionalTax: 200,
        tdsDeduction: 1500,
        bankName: '',
        bankAccountNo: '',
        bankIfsc: '',
        panNumber: ''
      });
    }
    this.isStructureModalOpen.set(true);
  }

  closeStructureModal(): void {
    this.isStructureModalOpen.set(false);
  }

  saveStructure(): void {
    const form = this.structureForm();
    if (!form.employeeId || form.basicSalary <= 0 || form.hra < 0) {
      this.feedbackMessage.set({ type: 'error', text: 'Please fill in valid salary amounts.' });
      return;
    }

    this.payrollService.saveSalaryStructure(form).subscribe({
      next: res => {
        if (res.success) {
          this.feedbackMessage.set({
            type: 'success',
            text: `Salary structure saved for ${res.data.employeeName}`
          });
          this.isStructureModalOpen.set(false);
          this.loadSalaryStructures();
        }
      },
      error: err => {
        this.feedbackMessage.set({
          type: 'error',
          text: err?.error?.message || 'Failed to save salary structure.'
        });
      }
    });
  }

  getMonthName(monthNum: number): string {
    const m = this.months.find(x => x.value === monthNum);
    return m ? m.name : `Month ${monthNum}`;
  }
}
