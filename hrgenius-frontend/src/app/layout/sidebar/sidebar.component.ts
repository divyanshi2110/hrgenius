import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'warning' | 'info';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  protected readonly isCollapsed = signal<boolean>(false);

  protected readonly navSections: NavSection[] = [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Employees', path: '/employees', icon: 'users' }
      ]
    },
    {
      title: 'TALENT ACQUISITION',
      items: [
        { label: 'Recruitment', path: '/recruitment', icon: 'briefcase' },
        { label: 'Onboarding', path: '/onboarding', icon: 'clipboard-check' }
      ]
    },
    {
      title: 'WORKFORCE OPERATIONS',
      items: [
        { label: 'Attendance & Leaves', path: '/attendance-leave', icon: 'calendar' },
        { label: 'Payroll Engine', path: '/payroll', icon: 'credit-card' }
      ]
    },
    {
      title: 'TALENT & GOVERNANCE',
      items: [
        { label: 'Performance (PMS)', path: '/performance', icon: 'trending-up' },
        { label: 'Compliance Tracker', path: '/compliance', icon: 'shield-check' },
        { label: 'Enterprise Reports', path: '/reports', icon: 'file-text' }
      ]
    }
  ];

  toggleCollapse(): void {
    this.isCollapsed.update(val => !val);
  }
}
