import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Department,
  Designation,
  Employee,
  EmployeeSummary,
  EmployeeCreatePayload,
  EmployeeUpdatePayload
} from '../../core/models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  protected readonly employeeService = inject(EmployeeService);
  protected readonly authService = inject(AuthService);

  // Active view tab
  protected activeTab = signal<'directory' | 'departments' | 'designations'>('directory');

  // Directory Data
  protected employees = signal<Employee[]>([]);
  protected departments = signal<Department[]>([]);
  protected designations = signal<Designation[]>([]);
  protected managers = signal<EmployeeSummary[]>([]);

  // Filter state
  protected searchKeyword = '';
  protected selectedDeptId: number | null = null;
  protected selectedStatus = '';
  protected isLoading = signal<boolean>(false);
  protected alertMessage = signal<{ type: 'success' | 'danger'; text: string } | null>(null);

  // Modals state
  protected showAddEmployeeModal = signal<boolean>(false);
  protected showEditEmployeeModal = signal<boolean>(false);
  protected showProfileModal = signal<boolean>(false);
  protected showDeptModal = signal<boolean>(false);
  protected showDesigModal = signal<boolean>(false);

  // Selected for viewing/editing
  protected selectedEmployee = signal<Employee | null>(null);

  // Form Models
  protected newEmployee: EmployeeCreatePayload = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().substring(0, 10),
    departmentId: 0,
    designationId: 0,
    managerId: null,
    createUserAccount: true,
    role: 'ROLE_EMPLOYEE'
  };

  protected editEmployeeData: EmployeeUpdatePayload = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: '',
    departmentId: 0,
    designationId: 0,
    managerId: null,
    status: 'ACTIVE'
  };

  protected newDept = { deptCode: '', deptName: '', description: '' };
  protected newDesig = { title: '', bandLevel: 'E1', departmentId: 0 };

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadDepartments();
    this.loadDesignations();
    this.loadManagers();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.employeeService.getEmployees(
      this.searchKeyword,
      this.selectedDeptId || undefined,
      this.selectedStatus || undefined
    ).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.employees.set(res.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', 'Failed to load employees: ' + (err.error?.message || err.message));
      }
    });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (res) => {
        if (res.success) {
          this.departments.set(res.data);
          if (res.data.length > 0 && !this.newEmployee.departmentId) {
            this.newEmployee.departmentId = res.data[0].id;
            this.newDesig.departmentId = res.data[0].id;
          }
        }
      }
    });
  }

  loadDesignations(): void {
    this.employeeService.getDesignations().subscribe({
      next: (res) => {
        if (res.success) {
          this.designations.set(res.data);
          if (res.data.length > 0 && !this.newEmployee.designationId) {
            this.newEmployee.designationId = res.data[0].id;
          }
        }
      }
    });
  }

  loadManagers(): void {
    this.employeeService.getManagers().subscribe({
      next: (res) => {
        if (res.success) {
          this.managers.set(res.data);
        }
      }
    });
  }

  // --- Search / Filter Actions ---
  onFilterChange(): void {
    this.loadEmployees();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedDeptId = null;
    this.selectedStatus = '';
    this.loadEmployees();
  }

  // --- Employee Actions ---
  openAddEmployee(): void {
    this.newEmployee = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      hireDate: new Date().toISOString().substring(0, 10),
      departmentId: this.departments().length > 0 ? this.departments()[0].id : 0,
      designationId: this.designations().length > 0 ? this.designations()[0].id : 0,
      managerId: null,
      createUserAccount: true,
      role: 'ROLE_EMPLOYEE'
    };
    this.showAddEmployeeModal.set(true);
  }

  submitAddEmployee(): void {
    if (!this.newEmployee.firstName || !this.newEmployee.lastName || !this.newEmployee.email) {
      this.showAlert('danger', 'Please provide First Name, Last Name, and Corporate Email.');
      return;
    }

    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAddEmployeeModal.set(false);
          this.showAlert('success', `Employee ${res.data.fullName} (${res.data.employeeCode}) provisioned successfully.`);
          this.loadEmployees();
          this.loadManagers();
        }
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to create employee.');
      }
    });
  }

  viewProfile(emp: Employee): void {
    this.selectedEmployee.set(emp);
    this.showProfileModal.set(true);
  }

  openEditEmployee(emp: Employee): void {
    this.selectedEmployee.set(emp);
    this.editEmployeeData = {
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      hireDate: emp.hireDate,
      departmentId: emp.departmentId || (this.departments().length > 0 ? this.departments()[0].id : 0),
      designationId: emp.designationId || (this.designations().length > 0 ? this.designations()[0].id : 0),
      managerId: emp.managerId || null,
      status: emp.status
    };
    this.showEditEmployeeModal.set(true);
  }

  submitEditEmployee(): void {
    const emp = this.selectedEmployee();
    if (!emp) return;

    this.employeeService.updateEmployee(emp.id, this.editEmployeeData).subscribe({
      next: (res) => {
        if (res.success) {
          this.showEditEmployeeModal.set(false);
          this.showAlert('success', `Employee ${res.data.employeeCode} profile updated.`);
          this.loadEmployees();
        }
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to update employee.');
      }
    });
  }

  toggleStatus(emp: Employee): void {
    const newStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const actionLabel = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${actionLabel} employee ${emp.fullName} (${emp.employeeCode})?`)) {
      return;
    }

    this.employeeService.toggleEmployeeStatus(emp.id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAlert('success', `Employee ${emp.employeeCode} is now ${newStatus}.`);
          this.loadEmployees();
        }
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to change status.');
      }
    });
  }

  // --- Department Actions ---
  openAddDept(): void {
    this.newDept = { deptCode: '', deptName: '', description: '' };
    this.showDeptModal.set(true);
  }

  submitAddDept(): void {
    if (!this.newDept.deptCode || !this.newDept.deptName) {
      this.showAlert('danger', 'Department code and name are required.');
      return;
    }

    this.employeeService.createDepartment(this.newDept).subscribe({
      next: (res) => {
        if (res.success) {
          this.showDeptModal.set(false);
          this.showAlert('success', `Department ${res.data.deptName} (${res.data.deptCode}) created.`);
          this.loadDepartments();
        }
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to create department.');
      }
    });
  }

  // --- Designation Actions ---
  openAddDesig(): void {
    this.newDesig = {
      title: '',
      bandLevel: 'E1',
      departmentId: this.departments().length > 0 ? this.departments()[0].id : 0
    };
    this.showDesigModal.set(true);
  }

  submitAddDesig(): void {
    if (!this.newDesig.title || !this.newDesig.departmentId) {
      this.showAlert('danger', 'Designation title and department are required.');
      return;
    }

    this.employeeService.createDesignation(this.newDesig).subscribe({
      next: (res) => {
        if (res.success) {
          this.showDesigModal.set(false);
          this.showAlert('success', `Designation ${res.data.title} created.`);
          this.loadDesignations();
        }
      },
      error: (err) => {
        this.showAlert('danger', err.error?.message || 'Failed to create designation.');
      }
    });
  }

  // Helper
  showAlert(type: 'success' | 'danger', text: string): void {
    this.alertMessage.set({ type, text });
    setTimeout(() => this.alertMessage.set(null), 5000);
  }
}
