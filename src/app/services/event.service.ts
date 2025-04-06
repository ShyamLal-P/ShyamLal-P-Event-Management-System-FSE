import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5081/api/Event'; // Adjust if different

  constructor(private http: HttpClient) {}

  addEvent(eventData: any): Observable<any> {
    return this.http.post(this.apiUrl, eventData);
  }
}
