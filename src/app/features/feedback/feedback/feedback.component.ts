import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HomeHeaderComponent } from '../../../shared/components/home-header/home-header.component';
import { EventService } from '../../../Core/services/event.service';
import { AuthService } from '../../../Core/services/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  imports: [SidebarComponent, CommonModule, HomeHeaderComponent],
})
export class FeedbackComponent implements OnInit {
  isSidebarOpen = false;
  events: any[] = []; 
  currentUserId: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService // Inject AuthService here
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('userToken');
  
    // If token is missing, redirect to login page
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    // Fetch the current user ID
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.currentUserId = user.id; // Assuming the user object contains an 'id' field
        this.getPastEventsWithoutFeedback();
      },
      (error) => {
        console.error('Error fetching current user:', error);
        this.router.navigate(['/login']);
      }
    );
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
        if (error === 'User is not logged in or no user ID found') {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  // Open Feedback Dialog
  openFeedbackDialog(event: any): void {
    // Get user ID and token from localStorage
    const userId = this.currentUserId;  // Use the currentUserId from AuthService
    const token = localStorage.getItem('userToken');     // Token can still be fetched from localStorage
  
    // Check if the user is logged in
    if (!userId || !token) {
      console.warn('User is not logged in or token is missing');
      this.router.navigate(['/login']);
      return;
    }
  
    // Open the dialog and pass the full event object, userId, and token
    this.dialog.open(FeedbackDialogComponent, {
      width: '600px',
      data: {
        eventId: event.id,  // Use event.id instead of this.eventId
        userId: userId,     // Use userId from AuthService
        token: token,       // Use token from localStorage
        event: event        // Pass the event details
      }
    });
  }  
}
