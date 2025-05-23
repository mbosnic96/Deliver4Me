import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class BidService {

private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


    placeBid(loadId: string, price: number, message: string, vehicleId: string) {
    return this.http.post(`${this.apiUrl}/api/bid/`, { loadId, price, message, vehicleId });
  }

  getBidsForLoad(id: string) {
    return this.http.get(`${this.apiUrl}/api/bid/${id}`);
  }

  acceptBid(loadId: string, bidId: string) {
    return this.http.post(`${this.apiUrl}/api/bid/${loadId}/accept/${bidId}`, {});
  }
}
