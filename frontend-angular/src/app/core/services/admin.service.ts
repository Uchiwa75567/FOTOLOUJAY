import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}