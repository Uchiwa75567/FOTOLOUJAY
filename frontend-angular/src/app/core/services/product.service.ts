import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  title: string;
  description: string;
  photoUrl: string;
  status: 'PENDING' | 'VALID' | 'DELETED';
  views: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  condition?: 'good' | 'average' | 'poor';
  phone?: string;
  address?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
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

  createProduct(data: { title: string; description: string; photoBase64: string; phone: string; address: string }): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, data);
  }

  republishProduct(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}/republish`, {});
  }
}
