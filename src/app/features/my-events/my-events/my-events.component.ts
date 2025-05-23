import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HomeHeaderComponent } from '../../../shared/components/home-header/home-header.component';
import { EventService } from '../../../Core/services/event.service';
import { jwtDecode } from 'jwt-decode';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditEventDialogComponent } from '../edit-event-dialog/edit-event-dialog.component';
import { ViewFeedbackDialogComponent } from '../view-feedback-dialog/view-feedback-dialog.component'; // Import ViewFeedbackDialogComponent
import JSConfetti from 'js-confetti'; // Import the jsConfetti library

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HomeHeaderComponent,
    MatDialogModule // Add ViewFeedbackDialogComponent to imports
  ],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  isSidebarOpen = true;
  userDetails: any = null;
  events: any[] = [];
  filteredEvents: any[] = [];
  activeTab: string = 'all';
  showScrollToTop: boolean = false;

  eventIdToDelete: string | null = null;
  showConfirmDialog: boolean = false;

  private jsConfetti = new JSConfetti(); // Initialize jsConfetti

  constructor(
    private eventService: EventService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userDetails = decodedToken;
      this.loadEvents();
    }
  }

  loadEvents(): void {
    if (this.userDetails?.uid) {
      this.eventService.getEventsByUserId(this.userDetails.uid).subscribe({
        next: (data: any[]) => {
          this.events = data;
          this.filteredEvents = [...this.events];
        },
        error: (error: any) => console.error('Error fetching events:', error)
      });
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;

    this.showScrollToTop = scrollPosition > 50;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.filterEvents(tab);
  }

  filterEvents(type: string): void {
    const currentTime = new Date();

    if (type === 'all') {
      this.filteredEvents = [...this.events];
    } else if (type === 'upcoming') {
      this.filteredEvents = this.events.filter(event => new Date(event.date) > currentTime);
    } else if (type === 'completed') {
      this.filteredEvents = this.events.filter(event => new Date(event.date) <= currentTime);
    }
  }

  confirmDelete(eventId: string): void {
    this.eventIdToDelete = eventId;
    this.showConfirmDialog = true;
  }

  deleteEvent(): void {
    if (this.eventIdToDelete) {
      const eventElement = document.getElementById(`event-${this.eventIdToDelete}`);
      if (eventElement) {
        eventElement.classList.add('break-effect');
        this.createSmokeEffect(eventElement);
        setTimeout(() => {
          if (this.eventIdToDelete) { // Ensure eventIdToDelete is not null
            this.eventService.deleteEvent(this.eventIdToDelete).subscribe({
              next: () => {
                this.events = this.events.filter(event => event.id !== this.eventIdToDelete);
                this.filteredEvents = [...this.events];
                this.showConfirmDialog = false;
                this.eventIdToDelete = null;
              },
              error: (error: any) => console.error('Error deleting event:', error)
            });
          }
        }, 500); // Wait for the animation to complete
      }
    }
  }

  createSmokeEffect(eventElement: HTMLElement): void {
    const smokeCount = 10; // Number of smoke elements
    for (let i = 0; i < smokeCount; i++) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke';
      smoke.style.top = `${eventElement.offsetTop + Math.random() * eventElement.offsetHeight}px`;
      smoke.style.left = `${eventElement.offsetLeft + Math.random() * eventElement.offsetWidth}px`;
      document.body.appendChild(smoke);

      // Remove smoke element after animation
      setTimeout(() => {
        smoke.remove();
      }, 1000);
    }
  }

  cancelDelete(): void {
    if (this.eventIdToDelete) {
      this.showConfirmDialog = false;
      this.eventIdToDelete = null;
    }
  }

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }

  navigateToAddEvent(): void {
    this.router.navigate(['/add-event']);
  }

  openEditDialog(event: any): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      data: { ...event }  // Make sure this includes event.id
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEvents(); // Refresh the events list after edit
      }
    });
  }

  // Add this method to support View Feedback Dialog
  openFeedbackDialog(event: any): void {
    const dialogRef = this.dialog.open(ViewFeedbackDialogComponent, {
      data: { eventId: event.id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Feedback dialog closed');
      }
    });

    this.triggerStarBlast(); // Trigger star blast effect
  }

  triggerStarBlast(): void {
    this.jsConfetti.addConfetti({
      confettiRadius: 6,
      confettiNumber: 100,
      emojis: ['⭐'],
      emojiSize: 30,
    });
  }
}
