import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface PerformanceGoal {
  id: number;
  title: string;
  category: 'ENGINEERING' | 'PRODUCT' | 'OPERATIONS' | 'SALES' | 'LEADERSHIP';
  owner: string;
  department: string;
  targetDate: string;
  progressPercent: number;
  weight: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'ACHIEVED';
  keyResults: string;
}

export interface AppraisalScorecard {
  id: number;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  manager: string;
  selfRating: number;
  managerRating: number;
  finalRating: number;
  technicalCompetence: number;
  leadershipValues: number;
  deliveryConsistency: number;
  reviewStatus: 'COMPLETED' | 'PENDING_MANAGER' | 'CALIBRATION';
  promotionEligible: boolean;
  managerComments: string;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  protected readonly authService = inject(AuthService);

  protected activeTab = signal<'appraisal' | 'goals' | 'scorecards' | 'grid'>('goals');
  protected searchKeyword = '';
  protected selectedDeptFilter = 'ALL';
  protected showNewGoalModal = signal<boolean>(false);
  protected selectedScorecard = signal<AppraisalScorecard | null>(null);

  protected goals = signal<PerformanceGoal[]>([
    {
      id: 1,
      title: 'Maintain 99.99% Production API Availability & P99 Latency < 120ms',
      category: 'OPERATIONS',
      owner: 'Rohan Deshmukh',
      department: 'Cloud Operations & SecOps',
      targetDate: '2026-12-31',
      progressPercent: 92,
      weight: 30,
      status: 'ON_TRACK',
      keyResults: 'Deploy multi-region cloud failover, automate Kubernetes pod auto-scaling, reduce database query bottlenecks.'
    },
    {
      id: 2,
      title: 'Architect & Deliver HRGenius Core Enterprise Platform V2.0',
      category: 'ENGINEERING',
      owner: 'Priya Sharma & Amit Verma',
      department: 'Software Engineering',
      targetDate: '2026-11-30',
      progressPercent: 88,
      weight: 35,
      status: 'ON_TRACK',
      keyResults: 'Complete RBAC, automated Payroll engine, attendance muster roll, and Angular 21 clean architecture.'
    },
    {
      id: 3,
      title: 'Achieve 100% Statutory Compliance in EPFO, ESIC, and Tax Filings',
      category: 'OPERATIONS',
      owner: 'Vikramaditya Roy & Tanvi Hegde',
      department: 'Finance & Operations',
      targetDate: '2026-12-31',
      progressPercent: 96,
      weight: 25,
      status: 'ON_TRACK',
      keyResults: 'Zero statutory penalties, timely Form 16 issuance, quarterly internal audit clearance.'
    },
    {
      id: 4,
      title: 'Scale Enterprise Client Pipeline to ₹2.5 Cr Annual Contract Value',
      category: 'SALES',
      owner: 'Meera Nair',
      department: 'Enterprise Sales & Marketing',
      targetDate: '2026-12-15',
      progressPercent: 78,
      weight: 40,
      status: 'ON_TRACK',
      keyResults: 'Close 6 multi-year SaaS contracts, expand inbound demo conversion rate by 15%.'
    },
    {
      id: 5,
      title: 'Deliver Automated Test Coverage of 85%+ across All Core APIs',
      category: 'ENGINEERING',
      owner: 'Sneha Patel-Mehta',
      department: 'Quality Assurance & Testing',
      targetDate: '2026-11-25',
      progressPercent: 74,
      weight: 30,
      status: 'AT_RISK',
      keyResults: 'Integrate regression test suites into GitLab/GitHub CI runners, run automated daily stress testing.'
    },
    {
      id: 6,
      title: 'Develop Predictive Employee Retention & Compensation Forecasting Engine',
      category: 'PRODUCT',
      owner: 'Arjun Kapoor',
      department: 'Data Science & AI Analytics',
      targetDate: '2026-12-20',
      progressPercent: 65,
      weight: 25,
      status: 'ON_TRACK',
      keyResults: 'Train XGBoost regression models on workforce attrition indicators and integrate with Executive Dashboard.'
    }
  ]);

  protected scorecards = signal<AppraisalScorecard[]>([
    {
      id: 1,
      employeeCode: 'EMP-002',
      employeeName: 'Priya Sharma',
      department: 'Software Engineering',
      designation: 'Engineering Lead',
      manager: 'Rajesh Kumar',
      selfRating: 4.8,
      managerRating: 4.7,
      finalRating: 4.75,
      technicalCompetence: 4.9,
      leadershipValues: 4.8,
      deliveryConsistency: 4.6,
      reviewStatus: 'COMPLETED',
      promotionEligible: true,
      managerComments: 'Exceptional engineering leadership. Delivered zero-defect payroll and RBAC modules ahead of schedule.'
    },
    {
      id: 2,
      employeeCode: 'EMP-003',
      employeeName: 'Amit Verma',
      department: 'Software Engineering',
      designation: 'Senior Software Engineer',
      manager: 'Priya Sharma',
      selfRating: 4.5,
      managerRating: 4.4,
      finalRating: 4.45,
      technicalCompetence: 4.6,
      leadershipValues: 4.2,
      deliveryConsistency: 4.5,
      reviewStatus: 'COMPLETED',
      promotionEligible: false,
      managerComments: 'Very dependable senior contributor. Deep mastery of Spring Boot and SQL optimization.'
    },
    {
      id: 3,
      employeeCode: 'EMP-005',
      employeeName: 'Rohan Deshmukh',
      department: 'Cloud Operations & SecOps',
      designation: 'Principal Cloud Architect',
      manager: 'Rajesh Kumar',
      selfRating: 4.9,
      managerRating: 4.8,
      finalRating: 4.85,
      technicalCompetence: 5.0,
      leadershipValues: 4.8,
      deliveryConsistency: 4.8,
      reviewStatus: 'COMPLETED',
      promotionEligible: true,
      managerComments: 'World-class cloud reliability track record. Single-handedly architected the zero-downtime deployment pipeline.'
    },
    {
      id: 4,
      employeeCode: 'EMP-009',
      employeeName: 'Meera Nair',
      department: 'Enterprise Sales & Marketing',
      designation: 'Enterprise Account Executive',
      manager: 'Rajesh Kumar',
      selfRating: 4.6,
      managerRating: 4.5,
      finalRating: 4.55,
      technicalCompetence: 4.4,
      leadershipValues: 4.7,
      deliveryConsistency: 4.6,
      reviewStatus: 'COMPLETED',
      promotionEligible: true,
      managerComments: 'Consistently surpassed Q3/Q4 enterprise quotas. Exceptional relationship building with enterprise clients.'
    },
    {
      id: 5,
      employeeCode: 'EMP-013',
      employeeName: 'Divya Krishnan',
      department: 'Software Engineering',
      designation: 'Senior Frontend Architect',
      manager: 'Priya Sharma',
      selfRating: 4.6,
      managerRating: 4.5,
      finalRating: 4.55,
      technicalCompetence: 4.8,
      leadershipValues: 4.3,
      deliveryConsistency: 4.6,
      reviewStatus: 'CALIBRATION',
      promotionEligible: false,
      managerComments: 'Outstanding frontend architectural execution. Built modern Angular standalone design system.'
    }
  ]);

  protected newGoal = {
    title: '',
    category: 'ENGINEERING' as PerformanceGoal['category'],
    owner: '',
    department: 'Software Engineering',
    targetDate: new Date().toISOString().substring(0, 10),
    weight: 25,
    keyResults: ''
  };

  ngOnInit(): void {}

  get filteredGoals(): PerformanceGoal[] {
    return this.goals().filter(g => {
      const matchSearch = !this.searchKeyword || g.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) || g.owner.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchDept = this.selectedDeptFilter === 'ALL' || g.department === this.selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }

  updateGoalProgress(goal: PerformanceGoal, delta: number): void {
    const newProgress = Math.max(0, Math.min(100, goal.progressPercent + delta));
    goal.progressPercent = newProgress;
    if (newProgress === 100) goal.status = 'ACHIEVED';
    else if (newProgress < 60) goal.status = 'AT_RISK';
    else goal.status = 'ON_TRACK';
    this.goals.update(list => list.map(g => g.id === goal.id ? { ...goal } : g));
  }

  createGoal(): void {
    if (!this.newGoal.title || !this.newGoal.owner) return;
    const created: PerformanceGoal = {
      id: Date.now(),
      title: this.newGoal.title,
      category: this.newGoal.category,
      owner: this.newGoal.owner,
      department: this.newGoal.department,
      targetDate: this.newGoal.targetDate,
      progressPercent: 0,
      weight: this.newGoal.weight,
      status: 'ON_TRACK',
      keyResults: this.newGoal.keyResults || 'Continuous delivery against corporate strategic milestones.'
    };
    this.goals.update(list => [created, ...list]);
    this.showNewGoalModal.set(false);
    this.newGoal = { title: '', category: 'ENGINEERING', owner: '', department: 'Software Engineering', targetDate: new Date().toISOString().substring(0, 10), weight: 25, keyResults: '' };
  }

  viewScorecard(sc: AppraisalScorecard): void {
    this.selectedScorecard.set(sc);
  }

  closeScorecard(): void {
    this.selectedScorecard.set(null);
  }
}
