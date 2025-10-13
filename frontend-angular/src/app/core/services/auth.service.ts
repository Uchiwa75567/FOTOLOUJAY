import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'VIP' | 'MODERATOR' | 'ADMIN';
  phone?: string;
  address?: string;
  isPremium?: boolean;
  premiumExpiry?: string | null;
}

export interface UserProfileUpdate {
  phone?: string;
  address?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  currentUser = signal<User | null>(null);
  isLoading = signal(true);
  isPremium = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (userStr && token) {
      this.currentUser.set(JSON.parse(userStr));
    }
    this.isLoading.set(false);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, { username, email, password })
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ accessToken: string }>(`${this.API_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  updateProfile(data: UserProfileUpdate): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/profile`, data)
      .pipe(
        tap(updatedUser => {
          const currentUser = this.currentUser();
          if (currentUser) {
            const mergedUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            this.currentUser.set(mergedUser);
          }
        })
      );
  }

  refreshUserData(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`)
      .pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
          this.isPremium.set(user.isPremium || false);
        })
      );
  }

  checkAndUpdatePremiumStatus(): void {
    if (this.isAuthenticated()) {
      this.refreshUserData().subscribe({
        error: (error) => console.error('Error refreshing user data:', error)
      });
    }
  }
}