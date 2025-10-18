import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ProductService, type Product } from '../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private location = inject(Location);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id));
    } else {
      this.router.navigate(['/']);
    }
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error.set('Erreur lors du chargement du produit');
        this.isLoading.set(false);
      }
    });
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:3001${url}`;
  }

  getConditionLabel(condition?: string): string {
    switch (condition) {
      case 'good':
        return 'Bon état';
      case 'average':
        return 'État moyen';
      case 'poor':
        return 'Mauvais état';
      default:
        return 'Non spécifié';
    }
  }

  getConditionClass(condition?: string): string {
    switch (condition) {
      case 'good':
        return 'condition-good';
      case 'average':
        return 'condition-average';
      case 'poor':
        return 'condition-poor';
      default:
        return '';
    }
  }

  goBack(): void {
    try {
      // 1) Prefer navigation state (works when navigate(..., { state }))
      const navState: any = history.state;
      if (navState && navState.fromModeration) {
        // Clear session flag for compatibility
        sessionStorage.removeItem('fromModeration');
        this.router.navigate(['/moderation']);
        return;
      }

      // 2) Fallback to sessionStorage (older flows)
      const fromModeration = sessionStorage.getItem('fromModeration');
      if (fromModeration === 'true') {
        sessionStorage.removeItem('fromModeration');
        this.router.navigate(['/moderation']);
        return;
      }

      // 3) Default behaviour: try to go back in history, else navigate to home
      this.location.back();
    } catch (e) {
      this.router.navigate(['/']);
    }
  }
}
