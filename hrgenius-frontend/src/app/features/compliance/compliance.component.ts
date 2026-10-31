import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface StatutoryFiling {
  id: number;
  statutoryBody: string;
  filingName: string;
  frequency: string;
  dueDate: string;
  period: string;
  amount: string;
  status: 'FILED' | 'PENDING' | 'OVERDUE';
  challanNumber?: string;
  filedDate?: string;
  responsibleOfficer: string;
}

export interface CorporatePolicy {
  id: number;
  policyCode: string;
  title: string;
  category: string;
  version: string;
  effectiveDate: string;
  mandatoryAcknowledgment: boolean;
  acknowledgedPercent: number;
  summary: string;
}

export interface AuditChecklistItem {
  id: number;
  area: string;
  requirement: string;
  regulation: string;
  status: 'COMPLIANT' | 'IN_REVIEW' | 'ATTENTION';
  lastAudited: string;
  auditor: string;
}

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})
export class ComplianceComponent implements OnInit {
  protected readonly authService = inject(AuthService);

  protected activeTab = signal<'filings' | 'policies' | 'audit'>('filings');
  protected searchKeyword = '';
  protected selectedPolicy = signal<CorporatePolicy | null>(null);

  protected filings = signal<StatutoryFiling[]>([
    {
      id: 1,
      statutoryBody: 'EPFO (Employees Provident Fund)',
      filingName: 'Monthly ECR Challan & Electronic Return',
      frequency: 'Monthly',
      dueDate: '2026-11-15',
      period: 'October 2026',
      amount: '₹1,44,200',
      status: 'FILED',
      challanNumber: 'EPF/2026/10/99824',
      filedDate: '2026-10-31',
      responsibleOfficer: 'Vikramaditya Roy'
    },
    {
      id: 2,
      statutoryBody: 'ESIC (Employees State Insurance)',
      filingName: 'Monthly Contribution Return (Form 5)',
      frequency: 'Monthly',
      dueDate: '2026-11-15',
      period: 'October 2026',
      amount: '₹38,400',
      status: 'FILED',
      challanNumber: 'ESI/2026/10/44812',
      filedDate: '2026-10-30',
      responsibleOfficer: 'Tanvi Hegde'
    },
    {
      id: 3,
      statutoryBody: 'State Professional Tax Authority',
      filingName: 'Karnataka PT Monthly Remittance (Form 5A)',
      frequency: 'Monthly',
      dueDate: '2026-11-20',
      period: 'October 2026',
      amount: '₹3,200',
      status: 'PENDING',
      responsibleOfficer: 'Tanvi Hegde'
    },
    {
      id: 4,
      statutoryBody: 'Income Tax Department (TDS)',
      filingName: 'Quarterly Salary TDS Return (Form 24Q)',
      frequency: 'Quarterly',
      dueDate: '2027-01-31',
      period: 'Q3 FY 2026-27',
      amount: '₹2,18,500',
      status: 'FILED',
      challanNumber: 'TDS/2026/Q2/77112',
      filedDate: '2026-10-25',
      responsibleOfficer: 'Vikramaditya Roy'
    },
    {
      id: 5,
      statutoryBody: 'POSH Committee / District Officer',
      filingName: 'Annual POSH Compliance & ICC Report',
      frequency: 'Annual',
      dueDate: '2027-01-15',
      period: 'Calendar Year 2026',
      amount: 'N/A (Statutory Report)',
      status: 'FILED',
      challanNumber: 'POSH-BLR-2026-01',
      filedDate: '2026-10-15',
      responsibleOfficer: 'Rajesh Kumar (HR Director)'
    },
    {
      id: 6,
      statutoryBody: 'Life Insurance Corporation (Gratuity)',
      filingName: 'Group Gratuity Fund Actuarial Valuation',
      frequency: 'Annual',
      dueDate: '2026-12-15',
      period: 'FY 2026-27',
      amount: '₹4,50,000',
      status: 'PENDING',
      responsibleOfficer: 'Vikramaditya Roy'
    }
  ]);

  protected policies = signal<CorporatePolicy[]>([
    {
      id: 1,
      policyCode: 'POL-HR-001',
      title: 'Corporate Code of Business Conduct & Ethics',
      category: 'Corporate Governance',
      version: 'v4.0 (2026)',
      effectiveDate: '2026-01-01',
      mandatoryAcknowledgment: true,
      acknowledgedPercent: 100,
      summary: 'Outlines standard enterprise ethical behavior, conflict of interest declarations, gifts & entertainment limits, and whistleblower reporting procedures.'
    },
    {
      id: 2,
      policyCode: 'POL-HR-002',
      title: 'Prevention of Sexual Harassment (POSH) Policy',
      category: 'Workplace Safety & Equal Opportunity',
      version: 'v3.2 (2026)',
      effectiveDate: '2026-01-01',
      mandatoryAcknowledgment: true,
      acknowledgedPercent: 100,
      summary: 'Strict adherence to POSH Act 2013 guidelines. Establishes the Internal Complaints Committee (ICC), complaint filing protocol, and confidential inquiry mechanism.'
    },
    {
      id: 3,
      policyCode: 'POL-SEC-004',
      title: 'Information Security & Data Protection (ISO 27001)',
      category: 'Cybersecurity & Data Privacy',
      version: 'v2.5 (2026)',
      effectiveDate: '2026-04-01',
      mandatoryAcknowledgment: true,
      acknowledgedPercent: 94,
      summary: 'Mandates password complexity, multi-factor authentication (MFA), strict data classification, and clean desk guidelines for remote and hybrid teams.'
    },
    {
      id: 4,
      policyCode: 'POL-OPS-003',
      title: 'Hybrid Work & Intellectual Property Protection',
      category: 'Workforce Operations',
      version: 'v3.0 (2026)',
      effectiveDate: '2026-06-01',
      mandatoryAcknowledgment: true,
      acknowledgedPercent: 96,
      summary: 'Rules governing official hardware allocation, secure VPN connection usage, confidential repository access, and company IP ownership.'
    },
    {
      id: 5,
      policyCode: 'POL-BEN-005',
      title: 'Comprehensive Leave & Attendance Governance',
      category: 'Benefits & Compensation',
      version: 'v2.1 (2026)',
      effectiveDate: '2026-01-01',
      mandatoryAcknowledgment: false,
      acknowledgedPercent: 88,
      summary: 'Defines 12 Casual Leaves, 10 Sick Leaves, 15 Privilege Leaves, carry-forward rules, and attendance muster roll regularization procedures.'
    }
  ]);

  protected auditChecklist = signal<AuditChecklistItem[]>([
    {
      id: 1,
      area: 'Muster Roll & Wage Register',
      requirement: 'Monthly digital attendance muster linked to payroll disbursements',
      regulation: 'Payment of Wages Act / Minimum Wages Act',
      status: 'COMPLIANT',
      lastAudited: '2026-10-25',
      auditor: 'KPMG External Audit Team'
    },
    {
      id: 2,
      area: 'Provident Fund (EPF) Compliance',
      requirement: '12% employer + 12% employee statutory contribution matched on ECR',
      regulation: 'EPF & MP Act 1952',
      status: 'COMPLIANT',
      lastAudited: '2026-10-31',
      auditor: 'Internal Finance Committee'
    },
    {
      id: 3,
      area: 'Workplace Equal Opportunity',
      requirement: 'Annual POSH awareness sessions and active 4-member ICC roster',
      regulation: 'Sexual Harassment of Women at Workplace Act 2013',
      status: 'COMPLIANT',
      lastAudited: '2026-10-18',
      auditor: 'Rajesh Kumar (HR Director)'
    },
    {
      id: 4,
      area: 'Information Security & Privacy',
      requirement: 'Role-based access control (RBAC) and BCrypt password encryption',
      regulation: 'DPDP Act 2023 / ISO 27001',
      status: 'COMPLIANT',
      lastAudited: '2026-10-28',
      auditor: 'Aditya Joshi (SecOps Lead)'
    }
  ]);

  ngOnInit(): void {}

  get filteredFilings(): StatutoryFiling[] {
    return this.filings().filter(f => {
      return !this.searchKeyword || f.filingName.toLowerCase().includes(this.searchKeyword.toLowerCase()) || f.statutoryBody.toLowerCase().includes(this.searchKeyword.toLowerCase());
    });
  }

  markAsFiled(filing: StatutoryFiling): void {
    filing.status = 'FILED';
    filing.filedDate = new Date().toISOString().substring(0, 10);
    filing.challanNumber = `CHL/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;
    this.filings.update(list => list.map(f => f.id === filing.id ? { ...filing } : f));
  }

  viewPolicy(p: CorporatePolicy): void {
    this.selectedPolicy.set(p);
  }

  closePolicyModal(): void {
    this.selectedPolicy.set(null);
  }
}
