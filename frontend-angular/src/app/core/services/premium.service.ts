import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PremiumPack {
  id: string;
  name: string;
  price: number;
  duration: number;
  unit: string;
}

export interface PremiumStatus {
  isPremium: boolean;
  premiumExpiry: string | null;
  daysRemaining: number;
}

export interface PurchaseResponse {
  success: boolean;
  paymentUrl: string;
  token: string;
  refCommand: string;
  pack: PremiumPack;
}

@Injectable({
  providedIn: 'root'
})
export class PremiumService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPacks(): Observable<{ packs: PremiumPack[] }> {
    return this.http.get<{ packs: PremiumPack[] }>(`${this.API_URL}/premium/packs`);
  }

  purchasePack(packId: string): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${this.API_URL}/premium/purchase`, { packId });
  }

  getPremiumStatus(): Observable<PremiumStatus> {
    return this.http.get<PremiumStatus>(`${this.API_URL}/premium/status`);
  }
}