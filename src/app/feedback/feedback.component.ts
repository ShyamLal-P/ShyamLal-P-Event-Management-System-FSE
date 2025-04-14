import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service'; 
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { Router } from '@angular/router'; // Import Router to handle redirection

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  imports: [SidebarComponent, CommonModule, HomeHeaderComponent],
})
export class FeedbackComponent implements OnInit {
  isSidebarOpen = false;
  events: any[] = []; 

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.getPastEventsWithoutFeedback();
  }

  onSidebarToggled(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  // Fetch past events without feedback
  getPastEventsWithoutFeedback() {
    this.eventService.getPastEventsWithoutFeedback().subscribe(
      (data) => {
        this.events = data; 
      },
      (error) => {
        console.error('Error fetching events:', error);
        // Optionally, handle error here (e.g., redirect to login if not authenticated)
        if (error === 'User is not logged in or no user ID found') {
          this.router.navigate(['/login']);  // Redirect to login page
        }
      }
    );
  }
}
