import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AdminService } from '../../core/services/admin.service';
import type { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
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
    this.router.navigate(['/product', product.id]);
  }

  getImageUrl(photoUrl: string): string {
    if (photoUrl.startsWith('http')) {
      return photoUrl;
    }
    return `http://localhost:3001${photoUrl}`;
  }
}
