import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Product } from './product.service';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  validProducts: number;
  pendingProducts: number;
  deletedProducts: number;
  vipUsers: number;
  adminUsers: number;
  moderatorUsers: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.API_URL}/admin/stats`);
  }

  // Moderator endpoints
  getPendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/admin/moderator/pending-products`);
  }

  validateProduct(id: number, description?: string): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/admin/moderator/products/${id}/validate`, { description });
  }

  rejectProduct(id: number, reason?: string): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/admin/moderator/products/${id}/reject`, { reason });
  }
}