import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookTicketDialogComponent } from '../book-ticket-dialog/book-ticket-dialog.component';
import { HomeHeaderComponent } from '../../home-header/home-header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-tickets',
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HomeHeaderComponent, SidebarComponent], // Add FormsModule here
})
export class BookTicketsComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  categories: string[] = [];
  searchTerm: string = '';
  selectedFilter: string = ''; // Add selectedFilter property
  selectedCategory: string = ''; // Add selectedCategory property
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
    this.eventService.getAllEvents().subscribe({
      next: (res: any[]) => {
        this.events = res;
        this.filteredEvents = res;
        this.categories = [...new Set(res.map(event => event.category))];
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearchTerm = event.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      let matchesFilter = true;

      if (this.selectedFilter === 'category') {
        matchesFilter = event.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.selectedFilter === 'price') {
        matchesFilter = event.eventPrice.toString().includes(this.searchTerm);
      } else if (this.selectedFilter === 'date') {
        matchesFilter = event.date.toLowerCase().includes(this.searchTerm.toLowerCase());
      }

      return matchesSearchTerm && matchesFilter;
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
 