import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HomeHeaderComponent } from '../../home-header/home-header.component';
import { TicketService } from '../../services/ticket.service';
import { CancelTicketDialogComponent } from '../cancel-ticket-dialog/cancel-ticket-dialog.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent, MatDialogModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  isSidebarOpen = true;
  userDetails: any = null;
  events: any[] = [];
  filteredEvents: any[] = [];
  activeTab: string = 'all';
  showScrollToTop: Boolean = false;
  successMessage: string | null = null;

  constructor(private ticketService: TicketService, private router: Router, public dialog: MatDialog) {}

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
      this.ticketService.getEventsByUserId(this.userDetails.uid).subscribe(
        (data: any[]) => {
          this.events = data;
          this.filteredEvents = this.events.filter(event => event.totalTickets - event.availableTickets > 0);
        },
        (error: any) => console.error('Error fetching events:', error)
      );
    }
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.filterEvents(tab);
  }

  filterEvents(type: string): void {
    const now = new Date();
    if (type === 'all') {
      this.filteredEvents = this.events.filter(event => event.totalTickets - event.availableTickets > 0);
    } else if (type === 'upcoming') {
      this.filteredEvents = this.events.filter(event => {
        const eventDateTime = new Date(event.date);
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);
        return eventDateTime > now && event.totalTickets - event.availableTickets > 0;
      });
    } else if (type === 'completed') {
      this.filteredEvents = this.events.filter(event => {
        const eventDateTime = new Date(event.date);
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);
        return eventDateTime <= now && event.totalTickets - event.availableTickets > 0;
      });
    }
  }

  isMoreThan24HoursAway(dateStr: string, timeStr: string): boolean {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const eventDateTime = new Date(dateStr);
    eventDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffInMs = eventDateTime.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours > 24;
  }

  isEventPassed(dateStr: string, timeStr: string): boolean {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const eventDateTime = new Date(dateStr);
    eventDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    return eventDateTime < now;
  }

  isEventStartedWithinHour(dateStr: string, timeStr: string): boolean {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const eventDateTime = new Date(dateStr);
    eventDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffInMs = now.getTime() - eventDateTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours <= 1 && diffInHours >= 0;
  }

  openCancelDialog(event: MouseEvent, eventData: any): void {
    event.preventDefault();
    const eventDataWithUserId = {
      ...eventData,
      userId: this.userDetails?.uid
    };

    const dialogRef = this.dialog.open(CancelTicketDialogComponent, {
      width: '400px',
      data: { event: eventDataWithUserId }
    });

    dialogRef.componentInstance.cancellationSuccess.subscribe((message: string) => {
      this.successMessage = message;
      this.loadEvents(); // Reload events after cancellation
    });
  }

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollToTop = scrollPosition > 50;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToBookTickets(): void {
    this.router.navigate(['/book-tickets']);
  }
}
