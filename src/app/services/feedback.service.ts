import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FeedbackRequest {
  eventId: string;
  userId: string;
  rating: number;
  comments: string;
}

export interface Feedback {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comments: string;
  submittedTime: string;
  submittedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:5081/api/';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: FeedbackRequest, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}EventFeedback`, feedback, { headers });
  }

  getFeedbacksByEventId(eventId: string): Observable<Feedback[]> {
    const token = localStorage.getItem('userToken'); // Retrieve the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Feedback[]>(`${this.apiUrl}Feedback/GetByEventId`, { eventId }, { headers });
  }
}
