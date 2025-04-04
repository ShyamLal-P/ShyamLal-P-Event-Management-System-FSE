import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../services/auth.service'; // Import AuthService
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [HeaderComponent]
})
export class SidebarComponent {
  isOpen = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {} // Inject AuthService and Router

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
