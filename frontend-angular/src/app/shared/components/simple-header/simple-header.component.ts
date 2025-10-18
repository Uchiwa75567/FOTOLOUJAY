import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-simple-header',
  standalone: true,
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss']
})
export class SimpleHeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private location = inject(Location);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goHome(): void {
    // If the user navigated to a product from the moderation page, we want the back
    // button to go to the homepage instead of history.back() (to avoid returning to moderation details).
    try {
      const fromModeration = sessionStorage.getItem('fromModeration');
      if (fromModeration === 'true') {
        sessionStorage.removeItem('fromModeration');
        this.router.navigate(['/']);
        return;
      }

      // Default: go back in history. If that fails, fallback to home.
      this.location.back();
    } catch (e) {
      this.router.navigate(['/']);
    }
  }
}
