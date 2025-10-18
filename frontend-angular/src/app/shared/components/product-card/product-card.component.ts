import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(private router: Router) {}

  getImageUrl(url?: string | null): string {
    if (!url) {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">No image</text></svg>';
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `http://localhost:3001${url}`;
  }

  onCardClick(): void {
    try {
      if (this.router.url && this.router.url.includes('/moderation')) {
        sessionStorage.setItem('fromModeration', 'true');
        this.router.navigate(['/product', this.product.id], { state: { fromModeration: true } });
        return;
      }
    } catch (e) {
      // ignore
    }

    this.router.navigate(['/product', this.product.id]);
  }
}
