import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 private hubConnection!: signalR.HubConnection;
  private notificationSubject = new Subject<any>();

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + '/notificationHub', {
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
    return this.http.get<any[]>(`${environment.apiUrl}/api/notification`);
  }

  markAsRead(id: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/notification/${id}/read`, {});
  }

  constructor(private http: HttpClient) {}
}