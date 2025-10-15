import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PremiumService } from '../../../core/services/premium.service';
import { NotificationService } from '../../../core/services/notification.service';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private premiumService = inject(PremiumService);
  private notificationService = inject(NotificationService);

  isPremium = signal(false);
  isLoadingPremium = signal(false);
  showNotifications = signal(false);
  showMenuDropdown = signal(false);
  unreadNotificationsCount = signal(0);
  notifications = signal<Notification[]>([]);

  private intervalId: any;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadPremiumStatus();
      this.loadNotifications();
      // Refresh notifications every 30 seconds
      this.intervalId = setInterval(() => {
        this.loadNotifications();
      }, 30000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private loadPremiumStatus(): void {
    this.isLoadingPremium.set(true);
    this.premiumService.getPremiumStatus().subscribe({
      next: (status: any) => {
        this.isPremium.set(status.isPremium);
        this.isLoadingPremium.set(false);
      },
      error: (error: any) => {
        console.error('Error loading premium status:', error);
        this.isLoadingPremium.set(false);
      }
    });
  }

  private loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (response: NotificationsResponse) => {
        this.notifications.set(response.notifications);
        this.unreadNotificationsCount.set(response.unreadCount);
      },
      error: (error: any) => {
        console.error('Error loading notifications:', error);
        // Fallback to mock data
        this.notifications.set([
          {
            id: '1',
            title: 'Bienvenue sur FOTOLJAY',
            message: 'Votre compte a été créé avec succès.',
            isRead: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Nouvelle annonce',
            message: 'Une nouvelle annonce a été publiée près de chez vous.',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
        this.unreadNotificationsCount.set(1);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
  }

  toggleMenuDropdown(): void {
    this.showMenuDropdown.set(!this.showMenuDropdown());
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error: any) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error: any) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInDays < 7) {
      return `Il y a ${Math.floor(diffInDays)}j`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isModerator(): boolean {
    const role = this.authService.currentUser()?.role;
    return role === 'MODERATOR' || role === 'ADMIN';
  }
}
