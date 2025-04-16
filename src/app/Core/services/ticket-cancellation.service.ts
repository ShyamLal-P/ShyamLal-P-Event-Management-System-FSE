import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketCancellationService {
  private apiUrl = 'http://localhost:5081/api/TicketCancellation'; // Base URL for cancellation

  constructor(private http: HttpClient) {}

  cancelTickets(userId: string, eventId: string, numberOfTickets: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { userId, eventId, numberOfTickets };
    return this.http.post(this.apiUrl, body);
  }
}