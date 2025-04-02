import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:5081/api/Auth/Login';
  private registerUrl = 'http://localhost:5081/api/Auth/Register';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(this.registerUrl, user);
  }
}
