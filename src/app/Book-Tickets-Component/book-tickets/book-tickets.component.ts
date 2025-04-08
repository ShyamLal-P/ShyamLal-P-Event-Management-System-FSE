import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookTicketDialogComponent } from '../book-ticket-dialog/book-ticket-dialog.component';
import { HomeHeaderComponent } from '../../home-header/home-header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-book-tickets',
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css'],
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent, SidebarComponent],
})
export class BookTicketsComponent implements OnInit {
  events: any[] = [];
  message: string | null = null;
  isSidebarOpen = true;
  userDetails: any = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('User Info:', res); // Make sure 'id' is printed
        this.userDetails = res;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
  
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (res: any[]) => {
        this.events = res;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  onSidebarToggled(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }

  bookEvent(event: any): void {
    const userId = this.userDetails?.id;
  
    if (!userId) {
      console.error('User ID is missing.');
      return;
    }
  
    const dialogRef = this.dialog.open(BookTicketDialogComponent, {
      width: '500px',
      data: {
        event: event,
        eventId: event.id,
        userId: userId
      },
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.message = 'Tickets booked successfully!';
        this.autoClearMessage();
        this.loadEvents();
      }
    });
  }
  

  autoClearMessage(): void {
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }
}
