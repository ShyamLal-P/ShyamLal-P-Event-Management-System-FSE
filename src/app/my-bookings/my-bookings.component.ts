import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TicketService } from '../services/ticket.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent]
})
export class MyBookingsComponent implements OnInit {
  bookedTickets: any[] = [];
  isSidebarOpen = true;
  userDetails: any = null;
  showMessage: boolean = false;
  message: string | null = null;

  constructor(private ticketService: TicketService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem('userRole', role);
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }

    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.userDetails = res;
        this.loadBookedTickets();
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });
  }

  loadBookedTickets(): void {
    if (this.userDetails && this.userDetails.uid) {
      this.ticketService.getTicketsByUserId(this.userDetails.uid).subscribe(
        (tickets) => {
          this.bookedTickets = tickets;
          console.log('Booked Tickets:', this.bookedTickets); // Log booked tickets to the console
        },
        (error) => {
          console.error('Error fetching booked tickets', error);
        }
      );
    }
  }

  onSidebarToggled(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }
}
