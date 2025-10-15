import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<NotificationsResponse> {
    return this.http.get<NotificationsResponse>(this.apiUrl);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/read-all`, {});
  }
}
