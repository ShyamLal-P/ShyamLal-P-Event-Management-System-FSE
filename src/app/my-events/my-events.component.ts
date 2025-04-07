import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { EventService } from '../services/event.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-my-events',
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  isSidebarOpen = true;
  userDetails: any = null;
  events: any[] = [];
  showConfirmDialog = false;
  eventIdToDelete: string | null = null;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userDetails = decodedToken;
      console.log('User details:', this.userDetails); // Log user details
      this.loadEvents();
    }
  }

  loadEvents(): void {
    if (this.userDetails && this.userDetails.uid) {
      this.eventService.getEventsByUserId(this.userDetails.uid).subscribe(
        (data: any[]) => {
          this.events = data;
          console.log('Events:', this.events); // Print events to the console
        },
        (error: any) => {
          console.error('Error fetching events:', error); // Log any errors
        }
      );
    }
  }

  confirmDelete(eventId: string): void {
    this.eventIdToDelete = eventId;
    this.showConfirmDialog = true;
  }

  deleteEvent(): void {
    if (this.eventIdToDelete) {
      this.eventService.deleteEvent(this.eventIdToDelete).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== this.eventIdToDelete);
          this.showConfirmDialog = false;
          this.eventIdToDelete = null;
        },
        error: (error: any) => {
          console.error('Error deleting event:', error); // Log any errors
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.eventIdToDelete = null;
  }

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }

  logClick(): void {
    console.log('Button clicked');
  }

  navigateToAddEvent(): void {
    this.router.navigate(['/add-event']);
  }
}
