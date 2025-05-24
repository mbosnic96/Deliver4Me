import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  submitReview(review: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/review/`, review);
  }

  getReviewsForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/review/user/${userId}`);
  }

  getUserRating(userId: string): Observable<{ averageRating: number; totalReviews: number }> {
    return this.http.get<{ averageRating: number; totalReviews: number }>(
      `${this.apiUrl}/api/review/user-rating/${userId}`
    );
  }
}
