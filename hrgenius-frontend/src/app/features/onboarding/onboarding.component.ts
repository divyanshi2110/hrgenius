import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface OnboardingTask {
  id: string;
  category: 'HR_DOCUMENTS' | 'IT_PROVISIONING' | 'TEAM_ORIENTATION' | 'PROBATION_REVIEW';
  title: string;
  assignee: string;
  completed: boolean;
  dueDate: string;
}

export interface NewJoinerOnboarding {
  id: number;
  fullName: string;
  email: string;
  role: string;
  department: string;
  joiningDate: string;
  buddy: string;
  manager: string;
  stage: 'PRE_BOARDING' | 'DAY_ONE' | 'WEEK_ONE' | 'PROBATION';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ATTENTION';
  tasks: OnboardingTask[];
}

export interface ITAssetAllocation {
  id: number;
  employeeName: string;
  assetType: string;
  model: string;
  serialNumber: string;
  assignedDate: string;
  status: 'PROVISIONED' | 'IN_TRANSIT' | 'PENDING';
  assignedBy: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  protected readonly authService = inject(AuthService);

  protected activeTab = signal<'joiners' | 'checklist' | 'assets'>('joiners');
  protected searchKeyword = '';
  protected selectedJoiner = signal<NewJoinerOnboarding | null>(null);
  protected showNewJoinerModal = signal<boolean>(false);

  protected joiners = signal<NewJoinerOnboarding[]>([
    {
      id: 1,
      fullName: 'Manish Chawla',
      email: 'manish.c@enterprise.internal',
      role: 'Enterprise Account Executive',
      department: 'Enterprise Sales & Marketing',
      joiningDate: '2026-11-03',
      buddy: 'Meera Nair',
      manager: 'Rajesh Kumar',
      stage: 'DAY_ONE',
      status: 'IN_PROGRESS',
      tasks: [
        { id: 't1', category: 'HR_DOCUMENTS', title: 'Aadhaar & PAN Identity Verification', assignee: 'HR Operations', completed: true, dueDate: '2026-11-01' },
        { id: 't2', category: 'HR_DOCUMENTS', title: 'Signed Employment Agreement & NDA', assignee: 'HR Operations', completed: true, dueDate: '2026-11-01' },
        { id: 't3', category: 'HR_DOCUMENTS', title: 'PF Form 11 & Gratuity Nomination', assignee: 'Finance Operations', completed: true, dueDate: '2026-11-02' },
        { id: 't4', category: 'IT_PROVISIONING', title: 'Corporate Laptop (MacBook Pro 16) Handover', assignee: 'IT Support', completed: true, dueDate: '2026-11-03' },
        { id: 't5', category: 'IT_PROVISIONING', title: 'Google Workspace & Slack SSO Provisioning', assignee: 'SecOps IT', completed: true, dueDate: '2026-11-03' },
        { id: 't6', category: 'TEAM_ORIENTATION', title: '1-on-1 Sales Territory Overview with Meera', assignee: 'Meera Nair', completed: false, dueDate: '2026-11-05' },
        { id: 't7', category: 'TEAM_ORIENTATION', title: 'CRM Salesforce & Pipeline Tools Access', assignee: 'Sales Ops', completed: false, dueDate: '2026-11-06' },
        { id: 't8', category: 'PROBATION_REVIEW', title: '30-Day Performance & Quota Onboarding Review', assignee: 'Rajesh Kumar', completed: false, dueDate: '2026-12-03' }
      ]
    },
    {
      id: 2,
      fullName: 'Harish Chandra',
      email: 'harish.c@startup.internal',
      role: 'Lead Product Manager',
      department: 'Product & UX Design',
      joiningDate: '2026-11-10',
      buddy: 'Ananya Sen',
      manager: 'Rajesh Kumar',
      stage: 'PRE_BOARDING',
      status: 'IN_PROGRESS',
      tasks: [
        { id: 't1', category: 'HR_DOCUMENTS', title: 'Aadhaar & PAN Identity Verification', assignee: 'HR Operations', completed: true, dueDate: '2026-11-05' },
        { id: 't2', category: 'HR_DOCUMENTS', title: 'Signed Employment Agreement & NDA', assignee: 'HR Operations', completed: true, dueDate: '2026-11-06' },
        { id: 't3', category: 'HR_DOCUMENTS', title: 'Direct Deposit Bank Mandate Form', assignee: 'Finance Operations', completed: false, dueDate: '2026-11-08' },
        { id: 't4', category: 'IT_PROVISIONING', title: 'Laptop Configuration & Dell UltraSharp Monitor', assignee: 'IT Support', completed: false, dueDate: '2026-11-09' },
        { id: 't5', category: 'TEAM_ORIENTATION', title: 'Product Roadmap & Customer Feedback Sync', assignee: 'Ananya Sen', completed: false, dueDate: '2026-11-12' },
        { id: 't6', category: 'PROBATION_REVIEW', title: '30-Day Product Feature Delivery Plan', assignee: 'Rajesh Kumar', completed: false, dueDate: '2026-12-10' }
      ]
    },
    {
      id: 3,
      fullName: 'Sunita Reddy',
      email: 'sunita.reddy@techcorp.internal',
      role: 'Principal Cloud Architect',
      department: 'Cloud Operations & SecOps',
      joiningDate: '2026-11-15',
      buddy: 'Rohan Deshmukh',
      manager: 'Rajesh Kumar',
      stage: 'PRE_BOARDING',
      status: 'IN_PROGRESS',
      tasks: [
        { id: 't1', category: 'HR_DOCUMENTS', title: 'Aadhaar & PAN Identity Verification', assignee: 'HR Operations', completed: true, dueDate: '2026-11-10' },
        { id: 't2', category: 'HR_DOCUMENTS', title: 'Signed Employment Agreement & NDA', assignee: 'HR Operations', completed: false, dueDate: '2026-11-12' },
        { id: 't3', category: 'IT_PROVISIONING', title: 'Lenovo ThinkPad P1 Workstation Allocation', assignee: 'IT Support', completed: false, dueDate: '2026-11-14' },
        { id: 't4', category: 'IT_PROVISIONING', title: 'Cloud Root AWS / GCP Bastion Access', assignee: 'SecOps', completed: false, dueDate: '2026-11-15' },
        { id: 't5', category: 'TEAM_ORIENTATION', title: 'Cloud Architecture & Disaster Recovery Briefing', assignee: 'Rohan Deshmukh', completed: false, dueDate: '2026-11-17' }
      ]
    },
    {
      id: 4,
      fullName: 'Pooja Agarwal',
      email: 'pooja.agarwal@hrgenius.internal',
      role: 'Marketing & Growth Lead',
      department: 'Enterprise Sales & Marketing',
      joiningDate: '2026-10-15',
      buddy: 'Meera Nair',
      manager: 'Rajesh Kumar',
      stage: 'PROBATION',
      status: 'COMPLETED',
      tasks: [
        { id: 't1', category: 'HR_DOCUMENTS', title: 'Aadhaar & PAN Identity Verification', assignee: 'HR Operations', completed: true, dueDate: '2026-10-12' },
        { id: 't2', category: 'HR_DOCUMENTS', title: 'Signed Employment Agreement & NDA', assignee: 'HR Operations', completed: true, dueDate: '2026-10-13' },
        { id: 't3', category: 'IT_PROVISIONING', title: 'Corporate Laptop & Hub Allocation', assignee: 'IT Support', completed: true, dueDate: '2026-10-14' },
        { id: 't4', category: 'TEAM_ORIENTATION', title: 'Enterprise Go-to-Market Strategy Overview', assignee: 'Meera Nair', completed: true, dueDate: '2026-10-18' },
        { id: 't5', category: 'PROBATION_REVIEW', title: '30-Day Orientation Review & Milestone Sign-off', assignee: 'Rajesh Kumar', completed: true, dueDate: '2026-11-15' }
      ]
    }
  ]);

  protected itAssets = signal<ITAssetAllocation[]>([
    {
      id: 501,
      employeeName: 'Manish Chawla',
      assetType: 'Laptop',
      model: 'Apple MacBook Pro 16" M3 Max',
      serialNumber: 'MBP-2026-00984',
      assignedDate: '2026-11-03',
      status: 'PROVISIONED',
      assignedBy: 'Aditya Joshi (IT SecOps)'
    },
    {
      id: 502,
      employeeName: 'Harish Chandra',
      assetType: 'Laptop & Display',
      model: 'Dell Precision 5570 + 27" 4K Monitor',
      serialNumber: 'DEL-2026-44821',
      assignedDate: '2026-11-09',
      status: 'IN_TRANSIT',
      assignedBy: 'Siddharth Malhotra'
    },
    {
      id: 503,
      employeeName: 'Sunita Reddy',
      assetType: 'Workstation',
      model: 'Lenovo ThinkPad P1 Gen 6',
      serialNumber: 'LNV-2026-78392',
      assignedDate: '2026-11-14',
      status: 'PENDING',
      assignedBy: 'Aditya Joshi (IT SecOps)'
    },
    {
      id: 504,
      employeeName: 'Divya Krishnan',
      assetType: 'Laptop',
      model: 'Apple MacBook Pro 14" M3 Pro',
      serialNumber: 'MBP-2026-00441',
      assignedDate: '2026-10-10',
      status: 'PROVISIONED',
      assignedBy: 'Aditya Joshi'
    }
  ]);

  protected newJoiner = {
    fullName: '',
    email: '',
    role: '',
    department: 'Software Engineering',
    joiningDate: new Date().toISOString().substring(0, 10),
    buddy: 'Priya Sharma',
    manager: 'Rajesh Kumar'
  };

  ngOnInit(): void {
    if (this.joiners().length > 0) {
      this.selectedJoiner.set(this.joiners()[0]);
    }
  }

  get filteredJoiners(): NewJoinerOnboarding[] {
    return this.joiners().filter(j => {
      return !this.searchKeyword || j.fullName.toLowerCase().includes(this.searchKeyword.toLowerCase()) || j.role.toLowerCase().includes(this.searchKeyword.toLowerCase());
    });
  }

  calculateProgress(joiner: NewJoinerOnboarding): number {
    if (!joiner.tasks || joiner.tasks.length === 0) return 0;
    const completed = joiner.tasks.filter(t => t.completed).length;
    return Math.round((completed / joiner.tasks.length) * 100);
  }

  selectJoiner(joiner: NewJoinerOnboarding): void {
    this.selectedJoiner.set(joiner);
    this.activeTab.set('checklist');
  }

  toggleTask(task: OnboardingTask): void {
    task.completed = !task.completed;
    const current = this.selectedJoiner();
    if (current) {
      const allCompleted = current.tasks.every(t => t.completed);
      if (allCompleted) {
        current.status = 'COMPLETED';
      } else {
        current.status = 'IN_PROGRESS';
      }
      this.selectedJoiner.set({ ...current });
      this.joiners.update(list => list.map(j => j.id === current.id ? { ...current } : j));
    }
  }

  createOnboarding(): void {
    if (!this.newJoiner.fullName || !this.newJoiner.role) return;
    const created: NewJoinerOnboarding = {
      id: Date.now(),
      fullName: this.newJoiner.fullName,
      email: this.newJoiner.email || 'joiner@hrgenius.internal',
      role: this.newJoiner.role,
      department: this.newJoiner.department,
      joiningDate: this.newJoiner.joiningDate,
      buddy: this.newJoiner.buddy,
      manager: this.newJoiner.manager,
      stage: 'PRE_BOARDING',
      status: 'IN_PROGRESS',
      tasks: [
        { id: 't1', category: 'HR_DOCUMENTS', title: 'Aadhaar & PAN Identity Verification', assignee: 'HR Operations', completed: false, dueDate: this.newJoiner.joiningDate },
        { id: 't2', category: 'HR_DOCUMENTS', title: 'Signed Employment Agreement & NDA', assignee: 'HR Operations', completed: false, dueDate: this.newJoiner.joiningDate },
        { id: 't3', category: 'IT_PROVISIONING', title: 'Corporate Workstation Allocation', assignee: 'IT Support', completed: false, dueDate: this.newJoiner.joiningDate },
        { id: 't4', category: 'TEAM_ORIENTATION', title: 'Department Orientation & Welcome Lunch', assignee: this.newJoiner.buddy, completed: false, dueDate: this.newJoiner.joiningDate }
      ]
    };
    this.joiners.update(list => [created, ...list]);
    this.selectedJoiner.set(created);
    this.showNewJoinerModal.set(false);
    this.newJoiner = { fullName: '', email: '', role: '', department: 'Software Engineering', joiningDate: new Date().toISOString().substring(0, 10), buddy: 'Priya Sharma', manager: 'Rajesh Kumar' };
  }
}
