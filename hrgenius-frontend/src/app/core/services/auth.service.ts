import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, UserSummary } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api/v1/auth';

  private readonly TOKEN_KEY = 'hrgenius_jwt_token';
  private readonly USER_KEY = 'hrgenius_user_profile';

  // Reactive state signals
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly userSignal = signal<UserSummary | null>(this.getStoredUser());

  readonly currentUser = computed(() => this.userSignal());
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly userRole = computed(() => this.userSignal()?.role || null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ROLE_ADMIN');
  readonly isManager = computed(() => this.userSignal()?.role === 'ROLE_MANAGER');

  login(credentials: { username: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const authData = response.data;
          this.setSession(authData.token, authData.user);
        }
      })
    );
  }

  fetchCurrentUser(): Observable<ApiResponse<UserSummary>> {
    return this.http.get<ApiResponse<UserSummary>>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.userSignal.set(response.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private setSession(token: string, user: UserSummary): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  private getStoredToken(): string | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem(this.TOKEN_KEY);
          localStorage.removeItem(this.USER_KEY);
          return null;
        }
      }
      return token;
    } catch {
      return null;
    }
  }

  private getStoredUser(): UserSummary | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
