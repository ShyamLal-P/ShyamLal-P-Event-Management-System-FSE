import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { EventService } from '../services/event.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  isSidebarOpen = true; // Tracks if the sidebar is open
  userDetails: any = null; // Stores user details decoded from token
  events: any[] = []; // All events retrieved for the user
  filteredEvents: any[] = []; // Filtered events displayed based on selection
  activeTab: string = 'all'; // Tracks the currently active tab (default is 'all')
  showScrollToTop: boolean = false;

  // Declare missing properties
  eventIdToDelete: string | null = null; // Holds the ID of the event to delete
  showConfirmDialog: boolean = false; // Tracks whether the confirmation dialog is displayed

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve and decode user token from localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userDetails = decodedToken;
      this.loadEvents(); // Load events based on user details
    }
  }

  // Loads events associated with the user's UID
  loadEvents(): void {
    if (this.userDetails && this.userDetails.uid) {
      this.eventService.getEventsByUserId(this.userDetails.uid).subscribe(
        (data: any[]) => {
          this.events = data; // Assign all retrieved events
          this.filteredEvents = [...this.events]; // Initially show all events
        },
        (error: any) => console.error('Error fetching events:', error)
      );
    }
  }

  @HostListener('window:scroll', [])
onScroll(): void {
  const scrollPosition =
    window.pageYOffset || 
    document.documentElement.scrollTop || 
    document.body.scrollTop || 0;

  console.log('Scroll position:', scrollPosition); // Debugging log
  this.showScrollToTop = scrollPosition > 50; // Adjust threshold if necessary
  console.log('Show Scroll-to-Top:', this.showScrollToTop); // Debugging log
}

scrollToTop(): void {
  console.log('Scroll-to-Top button clicked'); // Debugging log
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

  // Sets the active tab and filters events accordingly
  selectTab(tab: string): void {
    this.activeTab = tab; // Update the active tab
    this.filterEvents(tab); // Filter events based on the active tab
  }

  // Filters events based on the selected tab
  filterEvents(type: string): void {
    const currentTime = new Date(); // Get the current time for comparison

    if (type === 'all') {
      this.filteredEvents = [...this.events]; // Show all events
    } else if (type === 'upcoming') {
      this.filteredEvents = this.events.filter(event => new Date(event.date) > currentTime); // Show future events
    } else if (type === 'completed') {
      this.filteredEvents = this.events.filter(event => new Date(event.date) <= currentTime); // Show past events
    }
  }

  // Confirms deletion of an event
  confirmDelete(eventId: string): void {
    this.eventIdToDelete = eventId; // Set the ID of the event to delete
    this.showConfirmDialog = true; // Display the confirmation dialog
  }

  // Deletes an event and updates the list
  deleteEvent(): void {
    if (this.eventIdToDelete) {
      this.eventService.deleteEvent(this.eventIdToDelete).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== this.eventIdToDelete);
          this.filteredEvents = [...this.events]; // Update the filtered list after deletion
          this.showConfirmDialog = false; // Hide the confirmation dialog
          this.eventIdToDelete = null; // Reset the ID of the event to delete
        },
        error: (error: any) => console.error('Error deleting event:', error)
      });
    }
  }

  // Cancels the delete confirmation dialog
  cancelDelete(): void {
    this.showConfirmDialog = false; // Hide the confirmation dialog
    this.eventIdToDelete = null; // Reset the ID of the event to delete
  }

  // Toggles the sidebar open or closed
  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }

  // Navigates to the "Add Event" page
  navigateToAddEvent(): void {
    this.router.navigate(['/add-event']);
  }
}