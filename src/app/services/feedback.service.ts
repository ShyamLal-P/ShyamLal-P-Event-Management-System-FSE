import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FeedbackRequest {
  eventId: string;
  userId: string;
  rating: number;
  comments: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:5081/api/EventFeedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: FeedbackRequest, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, feedback, { headers });
  }
}
