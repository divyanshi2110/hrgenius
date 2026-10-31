import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export type ReportType = 'CENSUS' | 'ATTENDANCE' | 'PAYROLL' | 'LEAVE' | 'DEPARTMENT';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  protected readonly authService = inject(AuthService);

  protected activeReport = signal<ReportType>('CENSUS');
  protected searchKeyword = '';
  protected selectedDeptFilter = 'ALL';

  // Master Census Data (All 16 employees)
  protected censusData = [
    { code: 'EMP-001', name: 'Rajesh Kumar', dept: 'Human Resources & Talent', desig: 'Director of Human Resources', hireDate: '2021-01-15', status: 'ACTIVE', manager: 'Board of Directors', email: 'admin@hrgenius.internal' },
    { code: 'EMP-002', name: 'Priya Sharma', dept: 'Software Engineering', desig: 'Engineering Lead', hireDate: '2022-03-01', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'manager@hrgenius.internal' },
    { code: 'EMP-003', name: 'Amit Verma', dept: 'Software Engineering', desig: 'Senior Software Engineer', hireDate: '2023-07-10', status: 'ACTIVE', manager: 'Priya Sharma', email: 'employee@hrgenius.internal' },
    { code: 'EMP-004', name: 'Sneha Patel-Mehta', dept: 'Quality Assurance & Testing', desig: 'Senior QA Automation Engineer', hireDate: '2023-09-15', status: 'ACTIVE', manager: 'Priya Sharma', email: 'sneha.patel@hrgenius.internal' },
    { code: 'EMP-005', name: 'Rohan Deshmukh', dept: 'Cloud Operations & SecOps', desig: 'Principal Cloud Architect', hireDate: '2022-04-10', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'rohan.deshmukh@hrgenius.internal' },
    { code: 'EMP-006', name: 'Ananya Sen', dept: 'Product & UX Design', desig: 'Lead Product Manager', hireDate: '2022-06-15', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'ananya.sen@hrgenius.internal' },
    { code: 'EMP-007', name: 'Karthik Iyer', dept: 'Product & UX Design', desig: 'Senior UX/UI Designer', hireDate: '2023-01-20', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'karthik.iyer@hrgenius.internal' },
    { code: 'EMP-008', name: 'Vikramaditya Roy', dept: 'Finance & Operations', desig: 'Financial Controller', hireDate: '2021-08-01', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'vikram.roy@hrgenius.internal' },
    { code: 'EMP-009', name: 'Meera Nair', dept: 'Enterprise Sales & Marketing', desig: 'Enterprise Account Executive', hireDate: '2023-03-12', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'meera.nair@hrgenius.internal' },
    { code: 'EMP-010', name: 'Arjun Kapoor', dept: 'Data Science & AI Analytics', desig: 'Senior Data Scientist', hireDate: '2023-05-18', status: 'ACTIVE', manager: 'Priya Sharma', email: 'arjun.kapoor@hrgenius.internal' },
    { code: 'EMP-011', name: 'Neha Singhania', dept: 'Human Resources & Talent', desig: 'Technical Recruiter', hireDate: '2023-09-01', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'neha.singhania@hrgenius.internal' },
    { code: 'EMP-012', name: 'Siddharth Malhotra', dept: 'Cloud Operations & SecOps', desig: 'DevOps & SRE Specialist', hireDate: '2023-11-10', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'siddharth.m@hrgenius.internal' },
    { code: 'EMP-013', name: 'Divya Krishnan', dept: 'Software Engineering', desig: 'Senior Frontend Architect', hireDate: '2022-10-05', status: 'ACTIVE', manager: 'Priya Sharma', email: 'divya.krishnan@hrgenius.internal' },
    { code: 'EMP-014', name: 'Tanvi Hegde', dept: 'Finance & Operations', desig: 'Payroll Specialist', hireDate: '2024-02-01', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'tanvi.hegde@hrgenius.internal' },
    { code: 'EMP-015', name: 'Aditya Joshi', dept: 'Cloud Operations & SecOps', desig: 'Cybersecurity Specialist', hireDate: '2023-08-15', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'aditya.joshi@hrgenius.internal' },
    { code: 'EMP-016', name: 'Pooja Agarwal', dept: 'Enterprise Sales & Marketing', desig: 'Marketing & Growth Lead', hireDate: '2024-01-10', status: 'ACTIVE', manager: 'Rajesh Kumar', email: 'pooja.agarwal@hrgenius.internal' }
  ];

  // Attendance Muster Data
  protected attendanceData = [
    { code: 'EMP-001', name: 'Rajesh Kumar', dept: 'Human Resources & Talent', presentDays: 21, wfhDays: 0, leaveDays: 1, lopDays: 0, totalHours: 176, rate: '95.5%' },
    { code: 'EMP-002', name: 'Priya Sharma', dept: 'Software Engineering', presentDays: 18, wfhDays: 4, leaveDays: 0, lopDays: 0, totalHours: 184, rate: '100.0%' },
    { code: 'EMP-003', name: 'Amit Verma', dept: 'Software Engineering', presentDays: 20, wfhDays: 1, leaveDays: 1, lopDays: 0, totalHours: 178, rate: '95.5%' },
    { code: 'EMP-004', name: 'Sneha Patel-Mehta', dept: 'Quality Assurance & Testing', presentDays: 19, wfhDays: 3, leaveDays: 0, lopDays: 0, totalHours: 180, rate: '100.0%' },
    { code: 'EMP-005', name: 'Rohan Deshmukh', dept: 'Cloud Operations & SecOps', presentDays: 17, wfhDays: 5, leaveDays: 0, lopDays: 0, totalHours: 186, rate: '100.0%' },
    { code: 'EMP-006', name: 'Ananya Sen', dept: 'Product & UX Design', presentDays: 20, wfhDays: 1, leaveDays: 1, lopDays: 0, totalHours: 175, rate: '95.5%' },
    { code: 'EMP-007', name: 'Karthik Iyer', dept: 'Product & UX Design', presentDays: 19, wfhDays: 2, leaveDays: 1, lopDays: 0, totalHours: 174, rate: '95.5%' },
    { code: 'EMP-008', name: 'Vikramaditya Roy', dept: 'Finance & Operations', presentDays: 22, wfhDays: 0, leaveDays: 0, lopDays: 0, totalHours: 182, rate: '100.0%' },
    { code: 'EMP-009', name: 'Meera Nair', dept: 'Enterprise Sales & Marketing', presentDays: 16, wfhDays: 6, leaveDays: 0, lopDays: 0, totalHours: 180, rate: '100.0%' },
    { code: 'EMP-010', name: 'Arjun Kapoor', dept: 'Data Science & AI Analytics', presentDays: 18, wfhDays: 4, leaveDays: 0, lopDays: 0, totalHours: 179, rate: '100.0%' },
    { code: 'EMP-011', name: 'Neha Singhania', dept: 'Human Resources & Talent', presentDays: 21, wfhDays: 1, leaveDays: 0, lopDays: 0, totalHours: 181, rate: '100.0%' },
    { code: 'EMP-012', name: 'Siddharth Malhotra', dept: 'Cloud Operations & SecOps', presentDays: 19, wfhDays: 3, leaveDays: 0, lopDays: 0, totalHours: 183, rate: '100.0%' },
    { code: 'EMP-013', name: 'Divya Krishnan', dept: 'Software Engineering', presentDays: 19, wfhDays: 3, leaveDays: 0, lopDays: 0, totalHours: 182, rate: '100.0%' },
    { code: 'EMP-014', name: 'Tanvi Hegde', dept: 'Finance & Operations', presentDays: 21, wfhDays: 1, leaveDays: 0, lopDays: 0, totalHours: 179, rate: '100.0%' },
    { code: 'EMP-015', name: 'Aditya Joshi', dept: 'Cloud Operations & SecOps', presentDays: 20, wfhDays: 2, leaveDays: 0, lopDays: 0, totalHours: 184, rate: '100.0%' },
    { code: 'EMP-016', name: 'Pooja Agarwal', dept: 'Enterprise Sales & Marketing', presentDays: 17, wfhDays: 5, leaveDays: 0, lopDays: 0, totalHours: 176, rate: '100.0%' }
  ];

  // Banking & Payroll Register Data
  protected payrollData = [
    { code: 'EMP-001', name: 'Rajesh Kumar', bank: 'HDFC Bank Ltd', accNo: '501001000001', ifsc: 'HDFC0001244', pan: 'ABCDE1001K', gross: 145000, ded: 16200, net: 128800 },
    { code: 'EMP-002', name: 'Priya Sharma', bank: 'HDFC Bank Ltd', accNo: '501001000002', ifsc: 'HDFC0001244', pan: 'ABCDE1002K', gross: 135000, ded: 14700, net: 120300 },
    { code: 'EMP-003', name: 'Amit Verma', bank: 'HDFC Bank Ltd', accNo: '501001000003', ifsc: 'HDFC0001244', pan: 'ABCDE1003K', gross: 105000, ded: 11200, net: 93800 },
    { code: 'EMP-004', name: 'Sneha Patel-Mehta', bank: 'HDFC Bank Ltd', accNo: '501001000004', ifsc: 'HDFC0001244', pan: 'ABCDE1004K', gross: 112000, ded: 12100, net: 99900 },
    { code: 'EMP-005', name: 'Rohan Deshmukh', bank: 'ICICI Bank Ltd', accNo: '501001000005', ifsc: 'ICIC0000981', pan: 'ABCDE1005K', gross: 155000, ded: 18200, net: 136800 },
    { code: 'EMP-006', name: 'Ananya Sen', bank: 'Axis Bank Ltd', accNo: '501001000006', ifsc: 'UTIB0000412', pan: 'ABCDE1006K', gross: 140000, ded: 15500, net: 124500 },
    { code: 'EMP-007', name: 'Karthik Iyer', bank: 'HDFC Bank Ltd', accNo: '501001000007', ifsc: 'HDFC0001244', pan: 'ABCDE1007K', gross: 115000, ded: 12600, net: 102400 },
    { code: 'EMP-008', name: 'Vikramaditya Roy', bank: 'State Bank of India', accNo: '501001000008', ifsc: 'SBIN0001290', pan: 'ABCDE1008K', gross: 138000, ded: 15100, net: 122900 },
    { code: 'EMP-009', name: 'Meera Nair', bank: 'HDFC Bank Ltd', accNo: '501001000009', ifsc: 'HDFC0001244', pan: 'ABCDE1009K', gross: 128000, ded: 13800, net: 114200 },
    { code: 'EMP-010', name: 'Arjun Kapoor', bank: 'Kotak Mahindra Bank', accNo: '501001000010', ifsc: 'KKBK0000192', pan: 'ABCDE1010K', gross: 130000, ded: 14200, net: 115800 },
    { code: 'EMP-011', name: 'Neha Singhania', bank: 'HDFC Bank Ltd', accNo: '501001000011', ifsc: 'HDFC0001244', pan: 'ABCDE1011K', gross: 88000, ded: 9400, net: 78600 },
    { code: 'EMP-012', name: 'Siddharth Malhotra', bank: 'HDFC Bank Ltd', accNo: '501001000012', ifsc: 'HDFC0001244', pan: 'ABCDE1012K', gross: 118000, ded: 13000, net: 105000 },
    { code: 'EMP-013', name: 'Divya Krishnan', bank: 'Axis Bank Ltd', accNo: '501001000013', ifsc: 'UTIB0000412', pan: 'ABCDE1013K', gross: 132000, ded: 14500, net: 117500 },
    { code: 'EMP-014', name: 'Tanvi Hegde', bank: 'HDFC Bank Ltd', accNo: '501001000014', ifsc: 'HDFC0001244', pan: 'ABCDE1014K', gross: 82000, ded: 8700, net: 73300 },
    { code: 'EMP-015', name: 'Aditya Joshi', bank: 'HDFC Bank Ltd', accNo: '501001000015', ifsc: 'HDFC0001244', pan: 'ABCDE1015K', gross: 120000, ded: 13300, net: 106700 },
    { code: 'EMP-016', name: 'Pooja Agarwal', bank: 'ICICI Bank Ltd', accNo: '501001000016', ifsc: 'ICIC0000981', pan: 'ABCDE1016K', gross: 110000, ded: 12000, net: 98000 }
  ];

  // Leave Ledger Data
  protected leaveData = [
    { code: 'EMP-001', name: 'Rajesh Kumar', dept: 'Human Resources & Talent', casualBal: 9, sickBal: 8, privBal: 12, totalBal: 29 },
    { code: 'EMP-002', name: 'Priya Sharma', dept: 'Software Engineering', casualBal: 10, sickBal: 9, privBal: 14, totalBal: 33 },
    { code: 'EMP-003', name: 'Amit Verma', dept: 'Software Engineering', casualBal: 8, sickBal: 9, privBal: 13, totalBal: 30 },
    { code: 'EMP-004', name: 'Sneha Patel-Mehta', dept: 'Quality Assurance & Testing', casualBal: 11, sickBal: 10, privBal: 15, totalBal: 36 },
    { code: 'EMP-005', name: 'Rohan Deshmukh', dept: 'Cloud Operations & SecOps', casualBal: 11, sickBal: 9, privBal: 14, totalBal: 34 },
    { code: 'EMP-006', name: 'Ananya Sen', dept: 'Product & UX Design', casualBal: 9, sickBal: 8, privBal: 13, totalBal: 30 },
    { code: 'EMP-007', name: 'Karthik Iyer', dept: 'Product & UX Design', casualBal: 9, sickBal: 10, privBal: 14, totalBal: 33 },
    { code: 'EMP-008', name: 'Vikramaditya Roy', dept: 'Finance & Operations', casualBal: 12, sickBal: 10, privBal: 15, totalBal: 37 },
    { code: 'EMP-009', name: 'Meera Nair', dept: 'Enterprise Sales & Marketing', casualBal: 10, sickBal: 9, privBal: 14, totalBal: 33 },
    { code: 'EMP-010', name: 'Arjun Kapoor', dept: 'Data Science & AI Analytics', casualBal: 11, sickBal: 10, privBal: 15, totalBal: 36 },
    { code: 'EMP-011', name: 'Neha Singhania', dept: 'Human Resources & Talent', casualBal: 10, sickBal: 9, privBal: 14, totalBal: 33 },
    { code: 'EMP-012', name: 'Siddharth Malhotra', dept: 'Cloud Operations & SecOps', casualBal: 11, sickBal: 10, privBal: 14, totalBal: 35 },
    { code: 'EMP-013', name: 'Divya Krishnan', dept: 'Software Engineering', casualBal: 10, sickBal: 9, privBal: 13, totalBal: 32 },
    { code: 'EMP-014', name: 'Tanvi Hegde', dept: 'Finance & Operations', casualBal: 12, sickBal: 10, privBal: 15, totalBal: 37 },
    { code: 'EMP-015', name: 'Aditya Joshi', dept: 'Cloud Operations & SecOps', casualBal: 10, sickBal: 9, privBal: 14, totalBal: 33 },
    { code: 'EMP-016', name: 'Pooja Agarwal', dept: 'Enterprise Sales & Marketing', casualBal: 11, sickBal: 10, privBal: 14, totalBal: 35 }
  ];

  // Department Summary Data
  protected deptSummaryData = [
    { name: 'Software Engineering', count: 3, monthlyCost: '₹3,72,000', avgSalary: '₹1,24,000', share: '18.7%' },
    { name: 'Cloud Operations & SecOps', count: 3, monthlyCost: '₹3,93,000', avgSalary: '₹1,31,000', share: '18.7%' },
    { name: 'Product & UX Design', count: 2, monthlyCost: '₹2,55,000', avgSalary: '₹1,27,500', share: '12.5%' },
    { name: 'Finance & Operations', count: 2, monthlyCost: '₹2,20,000', avgSalary: '₹1,10,000', share: '12.5%' },
    { name: 'Enterprise Sales & Marketing', count: 2, monthlyCost: '₹2,38,000', avgSalary: '₹1,19,000', share: '12.5%' },
    { name: 'Human Resources & Talent', count: 2, monthlyCost: '₹2,33,000', avgSalary: '₹1,16,500', share: '12.5%' },
    { name: 'Quality Assurance & Testing', count: 1, monthlyCost: '₹1,12,000', avgSalary: '₹1,12,000', share: '6.2%' },
    { name: 'Data Science & AI Analytics', count: 1, monthlyCost: '₹1,30,000', avgSalary: '₹1,30,000', share: '6.2%' }
  ];

  ngOnInit(): void {}

  get filteredCensus() {
    return this.censusData.filter(e => {
      const matchSearch = !this.searchKeyword || e.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || e.code.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchDept = this.selectedDeptFilter === 'ALL' || e.dept === this.selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }

  get filteredAttendance() {
    return this.attendanceData.filter(e => {
      const matchSearch = !this.searchKeyword || e.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || e.code.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchDept = this.selectedDeptFilter === 'ALL' || e.dept === this.selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }

  get filteredPayroll() {
    return this.payrollData.filter(e => {
      return !this.searchKeyword || e.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || e.code.toLowerCase().includes(this.searchKeyword.toLowerCase());
    });
  }

  get filteredLeave() {
    return this.leaveData.filter(e => {
      const matchSearch = !this.searchKeyword || e.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || e.code.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchDept = this.selectedDeptFilter === 'ALL' || e.dept === this.selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }

  exportCSV(): void {
    let csvContent = '';
    const dateStr = new Date().toISOString().substring(0, 10);
    let fileName = `HRGenius_Report_${dateStr}.csv`;

    if (this.activeReport() === 'CENSUS') {
      fileName = `HRGenius_Workforce_Census_${dateStr}.csv`;
      csvContent = 'Employee Code,Full Name,Department,Designation,Hire Date,Status,Manager,Work Email\n';
      this.filteredCensus.forEach(e => {
        csvContent += `"${e.code}","${e.name}","${e.dept}","${e.desig}","${e.hireDate}","${e.status}","${e.manager}","${e.email}"\n`;
      });
    } else if (this.activeReport() === 'ATTENDANCE') {
      fileName = `HRGenius_Attendance_Muster_${dateStr}.csv`;
      csvContent = 'Employee Code,Full Name,Department,Present Days,WFH Days,Leave Days,LOP Days,Total Hours,Rate\n';
      this.filteredAttendance.forEach(e => {
        csvContent += `"${e.code}","${e.name}","${e.dept}",${e.presentDays},${e.wfhDays},${e.leaveDays},${e.lopDays},${e.totalHours},"${e.rate}"\n`;
      });
    } else if (this.activeReport() === 'PAYROLL') {
      fileName = `HRGenius_Payroll_Bank_Register_${dateStr}.csv`;
      csvContent = 'Employee Code,Full Name,Bank Name,Account Number,IFSC Code,PAN Number,Gross Salary,Deductions,Net Transfer\n';
      this.filteredPayroll.forEach(e => {
        csvContent += `"${e.code}","${e.name}","${e.bank}","${e.accNo}","${e.ifsc}","${e.pan}",${e.gross},${e.ded},${e.net}\n`;
      });
    } else if (this.activeReport() === 'LEAVE') {
      fileName = `HRGenius_Leave_Ledger_${dateStr}.csv`;
      csvContent = 'Employee Code,Full Name,Department,Casual Leave Bal,Sick Leave Bal,Privilege Leave Bal,Total Balance\n';
      this.filteredLeave.forEach(e => {
        csvContent += `"${e.code}","${e.name}","${e.dept}",${e.casualBal},${e.sickBal},${e.privBal},${e.totalBal}\n`;
      });
    } else if (this.activeReport() === 'DEPARTMENT') {
      fileName = `HRGenius_Department_Headcount_${dateStr}.csv`;
      csvContent = 'Department Name,Active Headcount,Monthly Payroll Cost,Average Salary,Workforce Share\n';
      this.deptSummaryData.forEach(d => {
        csvContent += `"${d.name}",${d.count},"${d.monthlyCost}","${d.avgSalary}","${d.share}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  printReport(): void {
    window.print();
  }
}
