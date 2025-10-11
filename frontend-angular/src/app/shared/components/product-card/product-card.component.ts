import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  
  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:3001${url}`;
  }
}