import { Component, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; // Import Router and NavigationEnd
import { AuthService } from '../../../Core/services/auth.service'; // Import AuthService
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  isOpen = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  userRole: string | null = null;
  activeRoute: string = ''; // To track the active route

  constructor(private authService: AuthService, private router: Router) {
    this.userRole = localStorage.getItem('userRole'); // Get role from localStorage

    // Listen to navigation events to update the activeRoute
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  // Check if the route matches the active route
  isActive(route: string): boolean {
    return this.activeRoute.includes(route);
  }
}