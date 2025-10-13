import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PremiumService } from '../../../core/services/premium.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  private premiumService = inject(PremiumService);
  
  isPremium = signal(false);
  isLoadingPremium = signal(false);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadPremiumStatus();
    }
  }

  private loadPremiumStatus(): void {
    this.isLoadingPremium.set(true);
    this.premiumService.getPremiumStatus().subscribe({
      next: (status) => {
        this.isPremium.set(status.isPremium);
        this.isLoadingPremium.set(false);
      },
      error: (error) => {
        console.error('Error loading premium status:', error);
        this.isLoadingPremium.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  isModerator(): boolean {
    const role = this.authService.currentUser()?.role;
    return role === 'MODERATOR' || role === 'ADMIN';
  }
}