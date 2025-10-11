import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService, type Product } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ProductCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  products: Product[] = [];
  isLoading = true;
  activeTab: 'all' | 'pending' | 'valid' | 'deleted' = 'all';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        const userId = this.authService.currentUser()?.id;
        this.products = products.filter(p => p.userId === userId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  get filteredProducts(): Product[] {
    if (this.activeTab === 'all') return this.products;
    return this.products.filter(p => {
      if (this.activeTab === 'pending') return p.status === 'PENDING';
      if (this.activeTab === 'valid') return p.status === 'VALID';
      if (this.activeTab === 'deleted') return p.status === 'DELETED';
      return true;
    });
  }

  get pendingCount(): number {
    return this.products.filter(p => p.status === 'PENDING').length;
  }

  get validCount(): number {
    return this.products.filter(p => p.status === 'VALID').length;
  }

  get deletedCount(): number {
    return this.products.filter(p => p.status === 'DELETED').length;
  }

  setActiveTab(tab: 'all' | 'pending' | 'valid' | 'deleted'): void {
    this.activeTab = tab;
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'VALID') return 'badge-success';
    if (status === 'PENDING') return 'badge-warning';
    if (status === 'DELETED') return 'badge-error';
    return '';
  }

  getStatusLabel(status: string): string {
    if (status === 'VALID') return 'Validé';
    if (status === 'PENDING') return 'En attente';
    if (status === 'DELETED') return 'Rejeté';
    return status;
  }
}