import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllLoads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/admin/all-loads`);
  }

    getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/admin/all-users`);
  }
  
}
