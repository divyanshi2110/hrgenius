import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  openings: number;
  filled: number;
  experience: string;
  location: string;
  employmentType: string;
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED';
  hiringManager: string;
  applicantsCount: number;
  postedDate: string;
  description: string;
}

export interface Candidate {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  appliedRole: string;
  department: string;
  currentCompany: string;
  experienceYears: number;
  stage: 'SOURCED' | 'SCREENING' | 'TECHNICAL' | 'MANAGERIAL' | 'OFFER' | 'HIRED';
  rating: number;
  appliedDate: string;
  notes: string;
  status: 'ACTIVE' | 'REJECTED' | 'HIRED';
}

export interface ScheduledInterview {
  id: number;
  candidateName: string;
  roleTitle: string;
  interviewer: string;
  roundName: string;
  scheduledTime: string;
  location: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {
  protected readonly authService = inject(AuthService);

  protected activeTab = signal<'requisitions' | 'pipeline' | 'interviews'>('requisitions');
  protected searchKeyword = '';
  protected selectedDeptFilter = 'ALL';
  protected selectedStageFilter = 'ALL';

  // Modals
  protected showNewJobModal = signal<boolean>(false);
  protected showNewCandidateModal = signal<boolean>(false);
  protected showScheduleModal = signal<boolean>(false);
  protected selectedCandidate = signal<Candidate | null>(null);

  // Data store
  protected jobOpenings = signal<JobOpening[]>([
    {
      id: 1,
      title: 'Senior Full-Stack Engineer (Angular / Java)',
      department: 'Software Engineering',
      openings: 3,
      filled: 1,
      experience: '5-8 Years',
      location: 'Bangalore, India (Hybrid)',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      hiringManager: 'Priya Sharma',
      applicantsCount: 14,
      postedDate: '2026-10-15',
      description: 'Lead enterprise microservices and modern Angular standalone UI design with focus on high concurrency and performance.'
    },
    {
      id: 2,
      title: 'Principal Cloud & Kubernetes Architect',
      department: 'Cloud Operations & SecOps',
      openings: 1,
      filled: 0,
      experience: '9-12 Years',
      location: 'Hyderabad, India (Remote)',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      hiringManager: 'Rohan Deshmukh',
      applicantsCount: 6,
      postedDate: '2026-10-18',
      description: 'Architect multi-region Kubernetes clusters, terraform IaC pipelines, and ensure zero-downtime resiliency.'
    },
    {
      id: 3,
      title: 'Lead Product Manager - Enterprise HRMS',
      department: 'Product & UX Design',
      openings: 1,
      filled: 0,
      experience: '6-10 Years',
      location: 'Bangalore, India (On-site)',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      hiringManager: 'Ananya Sen',
      applicantsCount: 9,
      postedDate: '2026-10-20',
      description: 'Define multi-quarter product roadmap for workforce analytics, compliance, and enterprise payroll capabilities.'
    },
    {
      id: 4,
      title: 'Enterprise Account Executive (FinTech & SaaS)',
      department: 'Enterprise Sales & Marketing',
      openings: 2,
      filled: 1,
      experience: '4-7 Years',
      location: 'Mumbai, India (Field)',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      hiringManager: 'Meera Nair',
      applicantsCount: 8,
      postedDate: '2026-10-22',
      description: 'Drive high-ACV enterprise software deals with Fortune 500 corporations and scale inbound pipeline.'
    },
    {
      id: 5,
      title: 'Senior QA Automation Architect (Playwright / Java)',
      department: 'Quality Assurance & Testing',
      openings: 2,
      filled: 0,
      experience: '5-8 Years',
      location: 'Pune, India (Hybrid)',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      hiringManager: 'Sneha Patel-Mehta',
      applicantsCount: 11,
      postedDate: '2026-10-25',
      description: 'Implement end-to-end continuous testing frameworks, API performance benchmarks, and regression suites.'
    },
    {
      id: 6,
      title: 'Senior Data Scientist (LLMs & Forecasting)',
      department: 'Data Science & AI Analytics',
      openings: 1,
      filled: 0,
      experience: '4-7 Years',
      location: 'Bangalore, India (Hybrid)',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      hiringManager: 'Arjun Kapoor',
      applicantsCount: 7,
      postedDate: '2026-10-28',
      description: 'Build predictive retention models, organizational network analytics, and compensation intelligence.'
    }
  ]);

  protected candidates = signal<Candidate[]>([
    {
      id: 101,
      fullName: 'Vikram Sethi',
      email: 'vikram.sethi@gmail.internal',
      phone: '+91 98201 11223',
      appliedRole: 'Senior Full-Stack Engineer (Angular / Java)',
      department: 'Software Engineering',
      currentCompany: 'Infosys Enterprise Solutions',
      experienceYears: 6.5,
      stage: 'TECHNICAL',
      rating: 4,
      appliedDate: '2026-10-22',
      notes: 'Strong hands-on Spring Boot, reactive microservices, and state management knowledge. Cleared screening with distinction.',
      status: 'ACTIVE'
    },
    {
      id: 102,
      fullName: 'Sunita Reddy',
      email: 'sunita.reddy@techcorp.internal',
      phone: '+91 97402 33445',
      appliedRole: 'Principal Cloud & Kubernetes Architect',
      department: 'Cloud Operations & SecOps',
      currentCompany: 'Wipro Cloud Services',
      experienceYears: 10,
      stage: 'MANAGERIAL',
      rating: 5,
      appliedDate: '2026-10-20',
      notes: 'Deep expertise in multi-cluster mesh, Helm charts, and AWS multi-account governance. Final VP round scheduled.',
      status: 'ACTIVE'
    },
    {
      id: 103,
      fullName: 'Harish Chandra',
      email: 'harish.c@startup.internal',
      phone: '+91 98112 44556',
      appliedRole: 'Lead Product Manager - Enterprise HRMS',
      department: 'Product & UX Design',
      currentCompany: 'Razorpay Enterprise',
      experienceYears: 7,
      stage: 'OFFER',
      rating: 5,
      appliedDate: '2026-10-18',
      notes: 'Offer letter extended. CTC negotiation approved at ₹34 LPA fixed + performance bonus. Anticipated joining Dec 1.',
      status: 'ACTIVE'
    },
    {
      id: 104,
      fullName: 'Deepa Swaminathan',
      email: 'deepa.swami@gmail.internal',
      phone: '+91 99001 55667',
      appliedRole: 'Senior QA Automation Architect (Playwright / Java)',
      department: 'Quality Assurance & Testing',
      currentCompany: 'Cognizant Tech Solutions',
      experienceYears: 5.8,
      stage: 'SCREENING',
      rating: 4,
      appliedDate: '2026-10-26',
      notes: 'Initial resume screening completed. Impressive background in Cypress/Playwright and CI/CD pipelines.',
      status: 'ACTIVE'
    },
    {
      id: 105,
      fullName: 'Manish Chawla',
      email: 'manish.c@enterprise.internal',
      phone: '+91 98711 66778',
      appliedRole: 'Enterprise Account Executive (FinTech & SaaS)',
      department: 'Enterprise Sales & Marketing',
      currentCompany: 'Zoho Corporation',
      experienceYears: 5,
      stage: 'HIRED',
      rating: 5,
      appliedDate: '2026-10-12',
      notes: 'Successfully hired as Enterprise AE. Transitioned into Onboarding module pipeline for induction.',
      status: 'HIRED'
    },
    {
      id: 106,
      fullName: 'Alok Mukherjee',
      email: 'alok.m@dataworks.internal',
      phone: '+91 98300 77889',
      appliedRole: 'Senior Data Scientist (LLMs & Forecasting)',
      department: 'Data Science & AI Analytics',
      currentCompany: 'Mu Sigma Inc',
      experienceYears: 4.5,
      stage: 'SOURCED',
      rating: 4,
      appliedDate: '2026-10-29',
      notes: 'Inbound application received via LinkedIn Talent Solutions. Portfolio shows strong Python and PyTorch projects.',
      status: 'ACTIVE'
    }
  ]);

  protected interviews = signal<ScheduledInterview[]>([
    {
      id: 201,
      candidateName: 'Vikram Sethi',
      roleTitle: 'Senior Full-Stack Engineer',
      interviewer: 'Priya Sharma (Engineering Lead)',
      roundName: 'Round 2: System Architecture & Coding',
      scheduledTime: 'Tomorrow at 14:30 IST',
      location: 'Google Meet (Enterprise Link)',
      status: 'SCHEDULED'
    },
    {
      id: 202,
      candidateName: 'Sunita Reddy',
      roleTitle: 'Principal Cloud Architect',
      interviewer: 'Rohan Deshmukh & Rajesh Kumar',
      roundName: 'Round 3: Executive Leadership Sync',
      scheduledTime: 'Wednesday at 11:00 IST',
      location: 'Boardroom A / Zoom Conference',
      status: 'SCHEDULED'
    },
    {
      id: 203,
      candidateName: 'Deepa Swaminathan',
      roleTitle: 'Senior QA Automation Architect',
      interviewer: 'Sneha Patel-Mehta',
      roundName: 'Round 1: Automation Frameworks Assessment',
      scheduledTime: 'Thursday at 16:00 IST',
      location: 'Microsoft Teams Link',
      status: 'SCHEDULED'
    }
  ]);

  // Form Models
  protected newJob = {
    title: '',
    department: 'Software Engineering',
    openings: 1,
    experience: '3-6 Years',
    location: 'Bangalore, India (Hybrid)',
    employmentType: 'Full-time',
    hiringManager: 'Priya Sharma',
    description: ''
  };

  protected newCandidate = {
    fullName: '',
    email: '',
    phone: '',
    appliedRole: 'Senior Full-Stack Engineer (Angular / Java)',
    currentCompany: '',
    experienceYears: 3,
    notes: ''
  };

  protected newInterview = {
    candidateName: '',
    roleTitle: '',
    interviewer: '',
    roundName: 'Technical Round 1',
    scheduledTime: '',
    location: 'Corporate Video Link'
  };

  ngOnInit(): void {}

  // Computed / filtered helpers
  get filteredJobs(): JobOpening[] {
    return this.jobOpenings().filter(j => {
      const matchSearch = !this.searchKeyword || j.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) || j.department.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchDept = this.selectedDeptFilter === 'ALL' || j.department === this.selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }

  get filteredCandidates(): Candidate[] {
    return this.candidates().filter(c => {
      const matchSearch = !this.searchKeyword || c.fullName.toLowerCase().includes(this.searchKeyword.toLowerCase()) || c.appliedRole.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchStage = this.selectedStageFilter === 'ALL' || c.stage === this.selectedStageFilter;
      return matchSearch && matchStage;
    });
  }

  getCandidatesByStage(stage: Candidate['stage']): Candidate[] {
    return this.candidates().filter(c => c.stage === stage);
  }

  advanceCandidate(candidate: Candidate): void {
    const stageFlow: Candidate['stage'][] = ['SOURCED', 'SCREENING', 'TECHNICAL', 'MANAGERIAL', 'OFFER', 'HIRED'];
    const currIdx = stageFlow.indexOf(candidate.stage);
    if (currIdx < stageFlow.length - 1) {
      const nextStage = stageFlow[currIdx + 1];
      this.candidates.update(list => list.map(c => c.id === candidate.id ? { ...c, stage: nextStage } : c));
      if (this.selectedCandidate()?.id === candidate.id) {
        this.selectedCandidate.set({ ...candidate, stage: nextStage });
      }
    }
  }

  openCandidateDetails(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
  }

  closeCandidateModal(): void {
    this.selectedCandidate.set(null);
  }

  createJobOpening(): void {
    if (!this.newJob.title) return;
    const newOpening: JobOpening = {
      id: Date.now(),
      title: this.newJob.title,
      department: this.newJob.department,
      openings: this.newJob.openings,
      filled: 0,
      experience: this.newJob.experience,
      location: this.newJob.location,
      employmentType: this.newJob.employmentType,
      status: 'ACTIVE',
      hiringManager: this.newJob.hiringManager,
      applicantsCount: 0,
      postedDate: new Date().toISOString().substring(0, 10),
      description: this.newJob.description || 'Enterprise role in workforce operations.'
    };
    this.jobOpenings.update(list => [newOpening, ...list]);
    this.showNewJobModal.set(false);
    this.newJob = { title: '', department: 'Software Engineering', openings: 1, experience: '3-6 Years', location: 'Bangalore, India (Hybrid)', employmentType: 'Full-time', hiringManager: 'Priya Sharma', description: '' };
  }

  submitCandidate(): void {
    if (!this.newCandidate.fullName || !this.newCandidate.email) return;
    const created: Candidate = {
      id: Date.now(),
      fullName: this.newCandidate.fullName,
      email: this.newCandidate.email,
      phone: this.newCandidate.phone,
      appliedRole: this.newCandidate.appliedRole,
      department: 'Software Engineering',
      currentCompany: this.newCandidate.currentCompany || 'Independent Professional',
      experienceYears: this.newCandidate.experienceYears,
      stage: 'SOURCED',
      rating: 4,
      appliedDate: new Date().toISOString().substring(0, 10),
      notes: this.newCandidate.notes || 'Inbound profile received.',
      status: 'ACTIVE'
    };
    this.candidates.update(list => [created, ...list]);
    this.showNewCandidateModal.set(false);
    this.newCandidate = { fullName: '', email: '', phone: '', appliedRole: 'Senior Full-Stack Engineer (Angular / Java)', currentCompany: '', experienceYears: 3, notes: '' };
  }

  scheduleInterview(): void {
    if (!this.newInterview.candidateName || !this.newInterview.scheduledTime) return;
    const item: ScheduledInterview = {
      id: Date.now(),
      candidateName: this.newInterview.candidateName,
      roleTitle: this.newInterview.roleTitle,
      interviewer: this.newInterview.interviewer,
      roundName: this.newInterview.roundName,
      scheduledTime: this.newInterview.scheduledTime,
      location: this.newInterview.location,
      status: 'SCHEDULED'
    };
    this.interviews.update(list => [item, ...list]);
    this.showScheduleModal.set(false);
  }
}
