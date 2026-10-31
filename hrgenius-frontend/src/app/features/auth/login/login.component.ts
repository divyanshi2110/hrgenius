import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected username = 'admin';
  protected password = 'Admin@123';
  protected showPassword = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected imageError = signal<boolean>(false);

  private returnUrl = '/dashboard';

  get illustrationUrl(): string {
    if (typeof window !== 'undefined') {
      const baseEl = document.querySelector('base');
      const baseHref = baseEl ? (baseEl.getAttribute('href') || '/') : '/';
      const cleanBase = baseHref === '/' ? '' : baseHref.replace(/\/+$/, '');
      if (cleanBase) {
        return `${cleanBase}/login-illustration.png`;
      }
      if (window.location.pathname.startsWith('/hrgenius') || window.location.href.includes('/hrgenius')) {
        return '/hrgenius/login-illustration.png';
      }
    }
    return 'login-illustration.png';
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('/hrgenius/login-illustration.png') && (window.location.pathname.includes('/hrgenius') || window.location.href.includes('github.io'))) {
      img.src = '/hrgenius/login-illustration.png';
    } else {
      this.imageError.set(true);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  handleLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter both email/username and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ username: this.username.trim(), password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage.set(res.message || 'Login failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Invalid credentials or backend unreachable';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  fillDemo(user: string, pass: string): void {
    this.username = user;
    this.password = pass;
    this.errorMessage.set(null);
  }
}
