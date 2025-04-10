import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, HomeHeaderComponent, SidebarComponent],
})
export class BookTicketsComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  categories: string[] = [];
  searchTerm: string = '';
  selectedFilter: string = '';
  selectedCategory: string = '';
  priceSortOrder: string = '';
  fromDate: string = '';
  toDate: string = '';
  minDate: string = new Date().toISOString().split('T')[0];
  message: string | null = null;
  isSidebarOpen = true;
  userDetails: any = null;
  showScrollToTop = false;
  flippedEventId: string | null = null; // Add this property to handle flipping

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('User Info:', res);
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
        this.filteredEvents = res;
        this.categories = [...new Set(res.map((event) => event.category))];
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter((event) => {
      const matchesSearchTerm = event.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      let matchesFilter = true;

      if (this.selectedFilter === 'category') {
        matchesFilter = this.selectedCategory
          ? event.category.toLowerCase() ===
            this.selectedCategory.toLowerCase()
          : true;
      } else if (
        this.selectedFilter === 'priceLowToHigh' ||
        this.selectedFilter === 'priceHighToLow'
      ) {
        matchesFilter = true; // No specific filtering needed for price sorting
      } else if (this.selectedFilter === 'date') {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        matchesFilter =
          (!this.fromDate || eventDate >= this.fromDate) &&
          (!this.toDate || eventDate <= this.toDate);
      }

      return matchesSearchTerm && matchesFilter;
    });

    this.sortEventsByPrice();
  }

  sortEventsByPrice(): void {
    if (this.selectedFilter === 'priceLowToHigh') {
      this.filteredEvents.sort((a, b) => a.eventPrice - b.eventPrice);
    } else if (this.selectedFilter === 'priceHighToLow') {
      this.filteredEvents.sort((a, b) => b.eventPrice - a.eventPrice);
    }
  }

  onSidebarToggled(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }

  toggleFlip(eventId: string): void {
    // Toggles the flipped state of the event tile
    this.flippedEventId = this.flippedEventId === eventId ? null : eventId;
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
        userId: userId,
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.showScrollToTop = scrollPosition > 50; // Show button if scrolled down more than 50px
  }

  scrollToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
  }
}
 