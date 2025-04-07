import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-book-tickets',
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css'],
  imports: [CommonModule, HomeHeaderComponent, SidebarComponent]
})
export class BookTicketsComponent implements OnInit {
  events: any[] = [];
  isSidebarOpen = true;
  userDetails: any = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
    const token = localStorage.getItem('userToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.userDetails = decodedToken;
      }
  }
  
    onSidebarToggled(open: boolean): void {
      this.isSidebarOpen = open;
    }
  
    logClick(): void {
      console.log('Button clicked');
    }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe((data: any[]) => {
      this.events = data;
    });
  }

  bookEvent(eventId: string): void {
    // Implement booking logic here
    console.log(`Booking event with ID: ${eventId}`);
  }
}
