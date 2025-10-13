import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { moderatorGuard } from './core/guards/moderator.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'moderation',
    loadComponent: () => import('./pages/moderation/moderation.component').then(m => m.ModerationComponent),
    canActivate: [authGuard, moderatorGuard]
  },
  {
    path: 'create-product',
    loadComponent: () => import('./pages/create-product/create-product.component').then(m => m.CreateProductComponent),
    canActivate: [authGuard]
  },
  {
    path: 'premium',
    loadComponent: () => import('./pages/premium/premium.component').then(m => m.PremiumComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];