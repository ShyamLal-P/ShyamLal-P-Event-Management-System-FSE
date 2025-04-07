import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import AuthService
 
@Component({
  selector: 'app-book-tickets',
  templateUrl: './book-tickets.component.html', // Correct templateUrl path
  styleUrls: ['./book-tickets.component.css'],
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent, SidebarComponent],
})
export class BookTicketsComponent implements OnInit {
  apiUrl: string = 'http://localhost:5081/api'; // Base API URL for backend
  events: any[] = []; // List of events to display
  message: string | null = null;
  isSidebarOpen = true;
  userDetails: any = null; // Holds user details for the header
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService for user data
  ) {}
 
  ngOnInit(): void {
    console.log('Book Tickets component initialized');
   
    // Fetch current user data dynamically for profile icon
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('Fetched User Details:', res);
        this.userDetails = res; // Dynamically populate user details
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
 
    // Fetch events from API
    this.http.get(`${this.apiUrl}/Event`).subscribe({
      next: (res: any) => {
        console.log('Fetched Events:', res);
        this.events = res; // Update events list dynamically
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }
 
  onSidebarToggled(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }
 
  bookEvent(eventId: string): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      const formData = {
        eventId: eventId,
        userId: this.userDetails?.userId, // Include user ID dynamically
      };
 
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
 
      this.http.post(`${this.apiUrl}/Ticket/Book`, formData, { headers }).subscribe({
        next: () => {
          this.message = 'Tickets booked successfully!';
          this.autoClearMessage();
        },
        error: (err) => {
          this.message = 'Failed to book tickets.';
          console.error(err);
          this.autoClearMessage();
        },
      });
    } else {
      this.message = 'User not authenticated.';
      this.autoClearMessage();
    }
  }
 
  autoClearMessage(): void {
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }
}