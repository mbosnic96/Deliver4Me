import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  
  private http = inject(HttpClient);
  private authService = inject(AuthService);
 private hubConnection!: signalR.HubConnection;
  private notificationSubject = new Subject<any>();
   private apiUrl = environment.apiUrl;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + '/notificationHub', {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(err => console.log(err));

    this.hubConnection.on('ReceiveNotification', (notification) => {
      this.notificationSubject.next(notification);
    });
  
  }

  onNotificationReceived(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  fetchNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/notification`);
  }

  markAsRead(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/notification/${id}/read`, {});
  }


}