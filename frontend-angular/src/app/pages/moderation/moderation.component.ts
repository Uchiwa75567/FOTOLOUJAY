import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { AdminService } from '../../core/services/admin.service';
import type { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ProductCardComponent],
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  pendingProducts = signal<Product[]>([]);
  isLoading = signal(true);
  selectedProduct = signal<Product | null>(null);
  showValidateModal = signal(false);
  showRejectModal = signal(false);
  editedDescription = signal('');
  rejectionReason = signal('');
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.isLoading.set(true);
    this.adminService.getPendingProducts().subscribe({
      next: (products) => {
        this.pendingProducts.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending products:', error);
        this.isLoading.set(false);
      }
    });
  }

  openValidateModal(product: Product): void {
    this.selectedProduct.set(product);
    this.editedDescription.set(product.description);
    this.showValidateModal.set(true);
  }

  openRejectModal(product: Product): void {
    this.selectedProduct.set(product);
    this.rejectionReason.set('');
    this.showRejectModal.set(true);
  }

  closeModals(): void {
    this.showValidateModal.set(false);
    this.showRejectModal.set(false);
    this.selectedProduct.set(null);
    this.editedDescription.set('');
    this.rejectionReason.set('');
  }

  validateProduct(): void {
    const product = this.selectedProduct();
    if (!product) return;

    this.isSubmitting.set(true);
    const description = this.editedDescription() !== product.description ? this.editedDescription() : undefined;

    this.adminService.validateProduct(product.id, description).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModals();
        this.loadPendingProducts();
      },
      error: (error) => {
        console.error('Error validating product:', error);
        this.isSubmitting.set(false);
        alert('Erreur lors de la validation du produit');
      }
    });
  }

  rejectProduct(): void {
    const product = this.selectedProduct();
    if (!product) return;

    this.isSubmitting.set(true);
    const reason = this.rejectionReason() || undefined;

    this.adminService.rejectProduct(product.id, reason).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModals();
        this.loadPendingProducts();
      },
      error: (error) => {
        console.error('Error rejecting product:', error);
        this.isSubmitting.set(false);
        alert('Erreur lors du rejet du produit');
      }
    });
  }

  viewProductDetails(product: Product): void {
    // Prefer sending navigation state so the product detail can detect origin reliably
    try {
      if (this.router.url && this.router.url.includes('/moderation')) {
        // include both navigation state and session storage for compatibility
        sessionStorage.setItem('fromModeration', 'true');
        this.router.navigate(['/product', product.id], { state: { fromModeration: true } });
        return;
      }
    } catch (e) {
      // ignore
    }

    this.router.navigate(['/product', product.id]);
  }

  getImageUrl(photoUrl?: string | null): string {
    // Backward compatible helper: accepts either a direct url string or a Product
    try {
      if (!photoUrl) {
        // placeholder SVG data URL
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">No image</text></svg>';
      }

      if (photoUrl.startsWith('http')) {
        return photoUrl;
      }

      return `http://localhost:3001${photoUrl}`;
    } catch (e) {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">No image</text></svg>';
    }
  }
}
