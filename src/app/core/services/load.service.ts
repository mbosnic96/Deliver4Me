import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoadService {
private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  addLoad(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/loads`, formData);
    
  }

  updateLoad(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  getMyLoads(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/loads/my-loads`);
}


  getLoadById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
