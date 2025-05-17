import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCurrentUser(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/api/users/me`);
  }

 updateProfile(data: any): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/api/users/me`, data);
}
updatePassword(dto: { currentPassword: string; newPassword: string }) {
  return this.http.post<void>(`${this.apiUrl}/api/users/me/password`, dto);
}

updateLocation(lat: number, lng: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/users/location`, {
    latitude: lat,
    longitude: lng
  });
}


  requestAccountDeletion(): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(`${this.apiUrl}/api/users/me/account-delete`, {});
}


}
