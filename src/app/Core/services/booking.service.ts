import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5081/api/';

  constructor(private http: HttpClient) {}

  // Updated to accept a single request body object
  bookTickets(bookingRequest: { userId: string, eventId: string, numberOfTickets: number }): Observable<any> {
    return this.http.post(this.apiUrl + 'Booking/BookTickets', bookingRequest);
  }
}
