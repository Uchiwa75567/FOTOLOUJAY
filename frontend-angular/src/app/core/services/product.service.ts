import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  title: string;
  description: string;
  photoUrl: string;
  price: number;
  status: 'PENDING' | 'VALID' | 'DELETED';
  rejectionReason?: string | null;
  views: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  condition?: 'good' | 'average' | 'poor';
  vip?: boolean;
  photos?: ProductPhoto[];
  user?: {
    id: number;
    username: string;
    role: string;
    phone?: string;
    address?: string;
    premiumExpiry?: string;
  };
}

export interface ProductPhoto {
  id: number;
  url: string;
  isMain: boolean;
  order: number;
  productId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`);
  }

  getUserProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/user/my-products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  createProduct(data: { title: string; description: string; price: number; photos: string[] }): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, data);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/search?q=${encodeURIComponent(query)}`);
  }

  republishProduct(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}/republish`, {});
  }
}
