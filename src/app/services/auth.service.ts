import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5081/api/Auth'; // API URL for authentication

  constructor(private http: HttpClient) { }

  // Method to handle user login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Method to handle user registration
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, user);
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken'); // Check if token exists in localStorage
  }
  logout() {
    localStorage.removeItem('userToken'); // Remove token from localStorage
  }

}
