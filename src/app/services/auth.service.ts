import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//   private registerUrl = 'http://localhost:5081/api/Auth/Register';
private apiUrl = 'http://localhost:5081/api/Auth'; // Update with your actual API URL


  constructor(private http: HttpClient) { }

//   register(user: any): Observable<any> {
//     return this.http.post(this.registerUrl, user);
login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
}
register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, user);
}
}
