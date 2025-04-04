import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // Inject AuthService and Router into the guard
  constructor(private authService: AuthService, private router: Router) {}

  // Method to check if the route can be activated
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Allow access if user is logged in
    } else {
      this.router.navigate(['/login']); // Redirect to login if user is not logged in
      return false; // Deny access
    }
  }
}
