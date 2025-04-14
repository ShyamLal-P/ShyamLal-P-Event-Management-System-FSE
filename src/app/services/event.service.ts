import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service'; // Assuming AuthService has method to get user ID
import { switchMap } from 'rxjs/operators'; // Don't forget to import switchMap

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5081/api/Event'; // Adjust if different

  constructor(
    private http: HttpClient,
    private authService: AuthService // To get user ID
  ) {}

  addEvent(eventData: any): Observable<any> {
    return this.http.post(this.apiUrl, eventData);
  }

  updateEvent(id: string, updatedEvent: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedEvent);
  }

  getEventById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getEventsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUpcomingEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/upcoming`);
  }

  getTopEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-events`);
  }

  // Updated Method to get Past Events Without Feedback for logged-in user
  getPastEventsWithoutFeedback(): Observable<any[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap((currentUser: any) => {
        const userId = currentUser?.id; // Assuming 'id' is part of the response object from getCurrentUser()
        
        if (!userId) {
          // If there's no userId, throw an error
          return throwError('User is not logged in or no user ID found');
        }

        // Set up the request headers with Authorization if needed
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
        });

        // Correct URL for past-events-without-feedback
        return this.http.post<any[]>(`${this.apiUrl}/past-events-without-feedback`, { userId }, { headers });
      })
    );
  }
}
