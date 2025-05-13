import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
    private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


 addVehicle(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/vehicles`, data);
}

getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/vehicles`);
  }

updateVehicle(id: string, formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/vehicles/${id}`, formData);
}
  getVehicleTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/vehicles/types`);
  }

    deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/vehicles/${id}`);
  }
}
