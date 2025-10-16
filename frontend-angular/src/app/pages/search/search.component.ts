import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  searchQuery = signal('');
  products = signal<Product[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      this.searchQuery.set(query);
      if (query) {
        this.performSearch(query);
      }
    });
  }

  private performSearch(query: string): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        // Simple search implementation - filter products by title/description
        const filteredProducts = products.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
        this.products.set(filteredProducts);
        this.hasSearched.set(true);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Search error:', error);
        this.products.set([]);
        this.hasSearched.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
