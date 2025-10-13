import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const moderatorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Allow MODERATOR and ADMIN
  if (user.role === 'MODERATOR' || user.role === 'ADMIN') {
    return true;
  }

  router.navigate(['/']);
  return false;
};