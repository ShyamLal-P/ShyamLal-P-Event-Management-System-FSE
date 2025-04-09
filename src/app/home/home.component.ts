import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { AuthService } from '../services/auth.service'; // 🔥 Import AuthService
import { EventService } from '../services/event.service'; // 🔥 Import EventService
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string | null = null;
  showMessage: boolean = false;
  isSidebarOpen = true;

  userDetails: any = null; // 🔥 Store current user
  topEvents: any[] = []; // 🔥 Store top events

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService, // 🔥 Inject AuthService
    private eventService: EventService // 🔥 Inject EventService
  ) {}

  onSidebarToggled(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  ngOnInit() {
    console.log('Home component initialized');

    const token = localStorage.getItem('userToken');
    console.log('Token from localStorage:', token);

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log('Role from token:', role);
        localStorage.setItem('userRole', role); // ✅ Save role in localStorage
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }

    this.message = this.messageService.getMessage();
    console.log('Received message in home component:', this.message);

    if (this.message) {
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    } else {
      console.log('No message received in home component');
    }

    // 🔥 Fetch current user data from API
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('User data:', res);
        this.userDetails = res;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });

    // 🔥 Fetch top events from API
    this.eventService.getTopEvents().subscribe({
      next: (events) => {
        console.log('Top events:', events);
        this.topEvents = events;
      },
      error: (err) => {
        console.error('Error fetching top events:', err);
      }
    });
  }
}
