import { Component, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { AuthService } from '../services/auth.service'; // Import AuthService
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

  constructor(private authService: AuthService, private router: Router) {
    this.userRole = localStorage.getItem('userRole'); // Get role from localStorage
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
}

