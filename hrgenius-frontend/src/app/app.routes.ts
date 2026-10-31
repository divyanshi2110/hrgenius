import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeesComponent } from './features/employees/employees.component';
import { RecruitmentComponent } from './features/recruitment/recruitment.component';
import { OnboardingComponent } from './features/onboarding/onboarding.component';
import { AttendanceLeaveComponent } from './features/attendance-leave/attendance-leave.component';
import { PayrollComponent } from './features/payroll/payroll.component';
import { PerformanceComponent } from './features/performance/performance.component';
import { ComplianceComponent } from './features/compliance/compliance.component';
import { ReportsComponent } from './features/reports/reports.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'employees',
        component: EmployeesComponent
      },
      {
        path: 'recruitment',
        component: RecruitmentComponent
      },
      {
        path: 'onboarding',
        component: OnboardingComponent
      },
      {
        path: 'attendance-leave',
        component: AttendanceLeaveComponent
      },
      {
        path: 'payroll',
        component: PayrollComponent
      },
      {
        path: 'performance',
        component: PerformanceComponent
      },
      {
        path: 'compliance',
        component: ComplianceComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
